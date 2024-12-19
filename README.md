# Backend API

This is the backend application for the Employee Performance Review system. Built with NestJS and TypeORM, it provides APIs for managing employees, performance reviews, and feedback.

## **API Endpoints**
### **Authentication**
1. **Register**: `POST /auth/register`
   - Payload: `{ name, email, password }`
   - Description: Register a new user.

2. **Login**: `POST /auth/login`
   - Payload: `{ email, password }`
   - Description: Log in and retrieve a JWT.
---

### **Employee Management (Admin Only)**
1. **Get All Employees**: `GET /employees`
   - Description: Retrieve a list of all employees, including soft-deleted ones.

2. **Create Employee**: `POST /employees`
   - Payload: `{ name, email, password, role }`
   - Description: Add a new employee.

3. **Update Employee**: `PUT /employees/:id`
   - Payload: `{ name, email }`
   - Description: Update employee details.

4. **Delete Employee**: `DELETE /employees/:id`
   - Description: Soft-delete an employee.

---

### **Performance Reviews (Admin Only)**
1. **Get All Reviews**: `GET /reviews`
   - Description: Retrieve all reviews.

2. **Create Review**: `POST /reviews`
   - Payload: `{ employeeId, title, description, status }`
   - Description: Create a new performance review.

3. **Update Review**: `PUT /reviews/:id`
   - Payload: `{ title, description, status }`
   - Description: Update an existing review.

4. **Assign Participants**: `POST /reviews/:id/participants`
   - Payload: `{ employeeIds }`
   - Description: Assign employees to a review.

---

### **Feedback Management**
1. **Submit Feedback (Employee Only)**: `POST /feedback`
   - Payload: `{ reviewId, comments }`
   - Description: Submit feedback for a review.

2. **Get Feedback for a Review (Admin Only)**: `GET /reviews/:id/feedbacks`
   - Description: Retrieve feedback for a specific review.

---

## **How to Run the Project Locally**
### **Requirements**
- Node.js (v18 or higher)
- MySQL database
- NPM or Yarn
- Docker (optional, for containerized deployment)

### **Steps**
1. Clone the repository:
```bash
git clone <repository-url>
cd backend
npm run start:dev
```