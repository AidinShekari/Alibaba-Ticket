# 🎫 Alibaba Ticket Finder
This Node.js application enables you to search for ticket availability on the alibaba.ir website. By utilizing the config.json file for configuration, it sends requests to find tickets. Make sure to install the necessary packages using npm install before running the application.

# **🚀 Quick Start**
Clone the repository: git clone https://github.com/DarkZo0m/alibaba-ticket
Navigate to the project directory: cd alibaba-ticket-finder
Install the required packages: npm install
Configure the application by updating the config.json file with your desired URLs and webhook URL.
Run the application: node index.js

# **⚙️ Configuration**
Update the config.json file with the following information:

urls: An array of URLs representing the ticket search queries on alibaba.ir.
webhookUrl: The Discord webhook URL to send ticket availability notifications.

# **📝 Description**
This application uses the provided URLs and makes requests to the alibaba.ir website to check for ticket availability. It utilizes the axios, moment-jalaali, and discord.js packages to handle HTTP requests, date conversion, and Discord webhook integration, respectively.
![image](https://github.com/DarkZo0m/alibaba-ticket/assets/59771519/aa9dc4ed-cfc1-4fb9-9c54-3ce04407f6fc)
