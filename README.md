<div align="center">

  <h1>Store Discount</h1>
  
<!-- Badges -->
<p>
  <a href="https://github.com/Muhthoriqas/Store-DiscountStore-Discount/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Muhthoriqas/Store-Discount" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/Muhthoriqas/Store-Discount" alt="last update" />
  </a>
  <a href="https://github.com/Muhthoriqas/Store-DiscountStore-Discount/network/members">
    <img src="https://img.shields.io/github/forks/Muhthoriqas/Store-Discount" alt="forks" />
  </a>
  <a href="https://github.com/Muhthoriqas/Store-DiscountStore-Discount/stargazers">
    <img src="https://img.shields.io/github/stars/Muhthoriqas/Store-Discount" alt="stars" />
  </a>
  <a href="https://github.com/Muhthoriqas/Store-DiscountStore-Discount/issues/">
    <img src="https://img.shields.io/github/issues/Muhthoriqas/Store-Discount" alt="open issues" />
  </a>
</p>
   
<h4>
      <a href="https://store-discount.vercel.app/">Live Demo</a>
  <span> · </span>
    <a href="https://github.com/Muhthoriqas/Store-Discount/issues">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/Muhthoriqas/Store-Discount/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  * [Screenshots](#camera-screenshots)
  * [Tech Stack](#space_invader-tech-stack)
  * [Environment Variables](#key-credential-file)
- [Getting Started](#toolbox-getting-started)
  * [Prerequisites](#bangbang-prerequisites)
  * [Run Locally With NPM](#running-run-locally-with-npm)
- [Contributing](#wave-contributing)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

  

<!-- About the Project -->
## :star2: About the Project


<!-- Screenshots -->
### :camera: Screenshots

#### Live Demo: https://store-discount.vercel.app/</h1>

![store-discount](https://github.com/Muhthoriqas/Store-Discount/assets/72277295/d739af37-9d1d-4f12-8093-4f0af7db4c90)
![store-discount-voucher](https://github.com/Muhthoriqas/Store-Discount/assets/72277295/58c47ece-5d01-42f4-af14-d1b622f945dd)

<!-- TechStack -->
### :space_invader: Tech Stack

  <h4>BackEnd:</h4>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" />

  <h4>FrontEnd:</h4>
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white"/>

<h4>Cloud:</h4>
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" />

<h4>Tools:</h4>
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" />

<!-- Env Variables -->
### :key: Credential File 

To run this project, you will need the following credential file:
  <ul>
    <li><a href="https://firebase.google.com/docs/admin/setup">Firebase Admin SDK</a> <br /> Go to firebase console -> pick your project -> project setting -> service account tab -> genereate new private key</li>
    <li><a href="https://firebase.google.com/docs/web/setup">Firebase Config/Client</a> <br /> Go to firebase console -> pick your project -> project setting -> in general tab scroll down -> click add app button -> pick web logo "<\>" -> fill app nickname & click register app -> copy all <em>const firebaseConfig</em> variabel value -> make a new json file -> paste value from firebaseConfig variabel before and save the json file</li>
  </ul>
  
_Note:_ 
  <em>Note: if you are someone i know, request & <strong>download my credential</strong> <a href="https://drive.google.com/drive/folders/1sId4l4MII9uacp-welga4b0qU1lGSFnw?usp=drive_link)">Here</a></em>
  
<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

* Install node.js version 18.16.0 <a href="https://nodejs.org/en/download">*here*<a/> <br />
  Make sure your node.js and npm already install in your device using, open cmd and run:
  ```bash
  node -v
  npm -v
  ```
   _**Note: In development i using `Windows 10 Pro`, `Visual Studio Code`, `node version 18.16.0`, and `npm version 9.5.1`.**_
* [Credential File](#key-credential-file)
* [Docker](https://www.docker.com/) (optional)

<!-- Installation -->
### :running: Run Locally With NPM

Follow this step to run this repostory code in your local device:
  1. Open git bash and Clone the repo
   ```sh
   git clone https://github.com/Muhthoriqas/Store-DiscountStore-Discount.git
   ```
  2. Go to project folder 
  ``` sh
  cd Store-Discount
  ``` 
3. Open the project at VS Code 
  ``` sh
  code . 
  ``` 
  4. open terminal, go to backend directory, & install package
  ``` sh
  cd backend && npm install
  ```
5. Make sure you already have the [Credential File](#key-credential-file) and store the credential *file name* in  `app/config/config.sample.json` file.
6. And also Change `projectID, bucketName, and databaseURL` value at `app/config/config.sample.json` file, with your GCP project id, bucket name, and firestore database url
7. Change `config.sample.json` file name to `config.json`
8. Start the server
   ```sh
   npm start, or
   npm run dev (using nodemon)
   ```
9. open new terminal and go to front end directory
  ```sh
  cd frontend && npm install 
  ```
10. Start the frontend server
   ```sh
   npm run dev 
   ```

 _Note:_
  1. Steps 5-7 are only performed if you do not have access to [My Credential](https://drive.google.com/drive/folders/1sId4l4MII9uacp-welga4b0qU1lGSFnw?usp=drive_link). If you are someone i know, please request to obtain my credentials and config file. After you download my credential make sure to store it at app/config folder.

<!-- Contributing -->
## :wave: Contributing

<h5>Contributtor in this repostory:</h5>
  
Contributions are always welcome!
All types of contributions are encouraged and valued. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which i would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

<!-- Contact -->
## :handshake: Contact

Muhammad Thoriq Ali Said - [LinkedIn](https://www.linkedin.com/in/thoriqas/) - [Github](https://github.com/Muhthoriqas) - [Instagram](https://www.instagram.com/mthoriq_as/)

<!-- Acknowledgments -->
## :gem: Acknowledgements

  Bellow is useful resource that i used in my project
 
 - [Next.js Docs](https://nextjs.org/docs)
 - [Express.js Docs](https://expressjs.com/)
 - [Clour Run Deploy With Artifact Registery](https://www.youtube.com/watch?v=b7G1pmd-0mk)
 - [Cloud Run CI/CD Tutorial](https://www.youtube.com/watch?v=Sh4I-s7O8rs&t=111s)
 - [Readme Template](https://github.com/Louis3797/awesome-readme-template)

