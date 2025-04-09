## Follow these steps to get the project up and running locally:


1. Install Git from https://git-scm.com/downloads  
   Verify it by running: `git --version`

2. Install Node.js from https://nodejs.org/  
   Verify it by running: `node -v` and `npm -v`

3. Install MySQL Server and MySQL Workbench from https://dev.mysql.com/downloads/   
   Note down your MySQL username, password, and host (default is `localhost:3306`)

4. Clone the repository using the command:  
   ```bash
   git clone https://github.com/Ramprasadmanna/Invoice-Management-System.git

   cd Invoice-Management-System
   ``` 


5. Install backend dependencies by running:
   ```bash 
   npm install
   ```

6. Navigate to the frontend folder and install frontend dependencies:  
   ```bash 
   cd client
   npm install
   cd ..
   ```

7. In the root folder, create a `.env` file and add your database connection string in the following format:

   ```bash
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="mysql://username:password@localhost:3306/invoicemanagementsystem"

   CURRENT_STATE=maharashtra

   MAIL_HOST=smtp.gmail.com
   MAIL_USER=
   MAIL_PASS=
   MAIL_RECEIVE=

   GST_ORDER_UUID=7989d5b3-c933-430f-afb1-e0be18f80015
   ORDER_UUID=28f75382-8bed-402b-a606-becfa490098e

   JWT_SECRET=mnvbcvjhdfbch
   ```

8. Run Prisma migration and generate client:  
   ```bash
    cd server
    npx prisma migrate deploy
    npx prisma generate
    cd ..
   ```

9. Import User Data:  
   ```bash
   npm run data:import
   ```

10. Start the development server using:  
    ```bash
    npm run dev
    ```

Your app should now be running at `http://localhost:3000`