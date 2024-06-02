const axios = require('axios');

// Замените <YOUR_API_KEY> на ваш Clerk API ключ
const apiKey = 'sk_test_vj76VrZLgCkWVRJ1UtJBr9tpWMmTV7KR4Ijq0XX33q';

// Формируем заголовки запроса
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
};

// Отправляем GET-запрос для получения списка пользователей
axios.get('https://api.clerk.dev/v1/users', { headers })
  .then(response => {
    if (response.status === 200) {
      const users = response.data;

      // Перебираем пользователей и выводим first_name, last_name и метаданные
      users.forEach(user => {
        const { first_name, last_name, public_metadata } = user;
        console.log(`First Name: ${first_name}, Last Name: ${last_name}`);

        // Проверяем, является ли public_metadata пустым
        if (public_metadata && Object.keys(public_metadata).length === 0) {
          // Присваиваем значение public_metadata
          user.public_metadata = { "role": 'user' };

          // Отправляем PATCH-запрос для обновления метаданных пользователя
          const userId = user.id;
          axios.patch(`https://api.clerk.dev/v1/users/${userId}/metadata`, {
            public_metadata: user.public_metadata
          }, { headers })
            .then(response => {
              if (response.status === 200) {
                console.log('Метаданные успешно обновлены');
              } else {
                console.log('Ошибка при обновлении метаданных');
              }
            })
            .catch(error => {
              console.log('Ошибка при выполнении запроса:', error.message);
            });
        }

        console.log('Metadata:', user.public_metadata.role);
      });
    } else {
      console.log('Ошибка при выполнении запроса');
    }
    
  })
  .catch(error => {
    console.log('Ошибка при выполнении запроса:', error.message);
  });