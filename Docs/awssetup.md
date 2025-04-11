**## Follow these steps to get the project up and running locally:**


1. SSH Into aws
``` bash
 ssh -i "your-key.pem" aws-id
```

2. Update And Upgrade
  ``` bash
  sudo apt update && sudo apt upgrade -y
  ```

3. Install NVM & Node.js
``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22

node -v  # Should show: v22.x
npm -v   # Should show: 10.x
```

4. Install & Setup Nginx
``` bash
sudo apt install nginx -y
sudo systemctl status nginx
```
Press `ctrl + c`


5. Install PM2 (Process Manager for Node)
 ``` bash
 npm install pm2 -g
 ```

6.  Clone the Project & Install Dependencies
 ```bash
 git clone https://github.com/Ramprasadmanna/Invoice-Management-System.git
cd Invoice-Management-System

**# Install server dependencies**
npm install

**# Install client dependencies and build**
cd client
npm install
npm run build
 ```

7. Deploy React Frontend to Nginx
 ```bash
 sudo mkdir -p /var/www/IMS-Client
 sudo cp -r dist/* /var/www/IMS-Client/

 # Set proper permissions
 sudo chmod -R 755 /var/www/IMS-Client
 
 sudo nano /etc/nginx/sites-available/ims

 #Paste This Config
   server {
    listen 80;
    server_name YOUR_DOMAIN_OR_PUBLIC_IP;

    root /var/www/IMS-Client;
    index index.html index.htm;

    location / {
        try_files $uri /index.html;
        autoindex off;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
   }
    # ----

    ctrl o
    enter
    ctrl x

    sudo ln -s /etc/nginx/sites-available/ims /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    cd ..
 ```

8. Install & Configure MySQL:
 ``` bash
 sudo apt install mysql-server
 sudo mysql_secure_installation

 #Enter All Y

 # Login & set password
 sudo mysql
 ALTER USER 'root'@'localhost' IDENTIFIED WITH   mysql_native_password BY 'Tiger@123';
 FLUSH PRIVILEGES;
 EXIT;

 #Then Test
 mysql -u root -p
 exit;
 ```

9. Create .env File
 ```bash
 #Create Inside Invoice-Management-System Folder
 nano .env

 #Paste This Config
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
 `ctrl o`
 `enter`
 `ctrl x`
 

10. Configure Prisma & Migrate DB:
 ``` bash
 cd server
 npx prisma migrate deploy
 npx prisma generate
 cd ..
 ```

10. Start Backend with PM2
 ``` bash
 npm run data:import
 pm2 start server/main.js --name ims-server
 pm2 startup
 pm2 save
 ```

10. Copy Fonts
 ``` bash
 # Create a .fonts directory in your home
 mkdir -p ~/.fonts

 # Copy Inter fonts from project to the fonts folder
 cp /home/ubuntu/Invoice-Management-System/server/data/Fonts/Inter.ttc /home/ubuntu/Invoice-Management-System/server/data/Fonts/*.ttf ~/.fonts/
 ```

10. Install Packages For PDF Genaration
 ``` bash
 sudo apt update && sudo apt-get update && sudo apt install -y \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libxcomposite1 \
  libxrandr2 \
  libxdamage1 \
  libpango-1.0-0 \
  libnss3 \
  libxshmfence1 \
  libgbm-dev \
  libx11-xcb1 \
  libxcursor1 \
  libxi6 \
  libxtst6 \
  libasound2t64 \
  libpangocairo-1.0-0 \
  libdrm2 \
  libdbus-1-3 \
  libxss1 \
  libxfixes3t64 \
  libglib2.0-0 \
  libgtk-3-0 \
  libcairo2 && \
 ```

  `pm2 restart ims-server`

11. DB Tunelling in Local Machine
 ``` bash
#Run This Command In Another Terminal

 ssh -i "yout-key.pem" -L 3307:localhost:3306 aws-id

 #Open My Sql Workbench And Add This Connection
 ```