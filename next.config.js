/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:[
            "utfs.io"
        ]
    }

}
module.exports = {
    async redirects() {
      return [
        {
          source: '/cher',
          destination: '../cher/src/App.js', // путь ко второму проекту
          permanent: false,
        },
      ];
    },
  };

module.exports = nextConfig
