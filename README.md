#Course work Project.




This project comprises a Vue.js front-end and an Express.js back-end, designed to manage a lesson booking system. The main features include:

	1.	Lesson Display: Users can view a list of at least 10 lessons, each with essential details such as price, location, subject, availability, and visual icons. The lessons are dynamically displayed using Vue.js’s v-for.
	2.	Sorting Functionality: Users can sort lessons by subject, location, price, or availability in both ascending and descending order.
	3.	Cart Management: Each lesson includes an “Add to Cart” button, which is enabled only when spaces are available. Once a lesson is added to the cart, the available spaces decrease. The button is disabled when spaces reach zero, ensuring users cannot add lessons with no availability.
	4.	Shopping Cart: The shopping cart is accessible once at least one lesson is added. It allows users to toggle between the cart and the main page, view added lessons, and remove them, which restores their availability.
	5.	Checkout Process: The checkout functionality is integrated into the shopping cart. The “Checkout” button becomes active after valid name and phone number inputs are provided. Input validation ensures names contain only letters and phone numbers consist of digits. Upon successful checkout, a confirmation message is displayed.

This project demonstrates the integration of front-end and back-end technologies to create a user-friendly lesson booking system, with attention to functionality and user experience.

**Technologies Used**

	•	HTML: The backbone of the application, providing the structure for web pages and content.
	•	Tailwind CSS: A utility-first CSS framework used to create responsive and visually appealing designs with ease, enabling rapid styling and customization.
	•	Node.js: A JavaScript runtime that allows the execution of JavaScript code server-side. It provides a non-blocking, event-driven architecture, making it ideal for building scalable applications.
	•	Express.js: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the routing and handling of requests and responses.
	•	MongoDB: A NoSQL database that stores data in a flexible, JSON-like format. It is used in the back-end to store user data and lesson information, facilitating easy data retrieval and manipulation.
