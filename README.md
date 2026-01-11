# **Timetable Maker: An Automated Scheduling System**

> **A "Human-in-the-Loop" Hybrid Scheduling Solution**

## **📖 Table of Contents**

1. [Project Overview](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#project-overview)
2. [Key Features](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#key-features)
3. [Tech Stack](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#tech-stack)
4. [System Architecture](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#system-architecture)
5. [Algorithm & Logic](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#algorithm--logic)
6. [Setup & Installation](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#setup--installation)
7. [API Reference](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#api-reference)
8. [Usage Workflow](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#usage-workflow)
9. [Future Scope](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#future-scope)
10. [Team](https://github.com/rushilkevadiya/TT_Maker/?tab=readme-ov-file#team)

---

## **Project Overview**

**Timetable Maker** is a web-based application designed to automate the complex task of academic scheduling. Unlike fully automated "black box" systems, it uses a **hybrid approach**: administrators can manually lock high-priority sessions (drag-and-drop), and the system uses an intelligent **Backtracking Algorithm** to fill the remaining slots without conflicts.

The system guarantees a **100% conflict-free timetable** by rigorously enforcing hard constraints like faculty availability, room capacity, and batch-wise allocation.

---

## **Key Features**

- **Hybrid Scheduling:** Drag-and-drop interface for manual pre-placement of sessions.

- **Automated Generation:** One-click generation using a modified backtracking algorithm.

- **Conflict Validation:** Immediate detection of invalid manual placements (e.g., double-booking a professor).

- **Entity Management:** Full CRUD operations for Classes, Faculty, Rooms, Labs, and Subjects.

- **Constraint Handling:** Supports complex rules like 2-hour Lab blocks, Faculty load balancing, and A/B Batch parallel sessions .

- **Interactive UI:** React-based Single Page Application (SPA) for real-time responsiveness.

---

## **Tech Stack**

| Component      | Technology          | Description                                          |
| -------------- | ------------------- | ---------------------------------------------------- |
| **Frontend**   | React.js (Vite)     | Dynamic SPA for user interaction & state management. |
| **Backend**    | Java Spring Boot 3  | REST API & core algorithmic engine.                  |
| **Language**   | Java 17+            | Core logic implementation.                           |
| **Build Tool** | Maven               | Backend dependency management.                       |
| **Algorithm**  | Custom Backtracking | Depth-First Search with optimization heuristics.     |

---

## **System Architecture**

The system follows a **Decoupled Client-Server Architecture**:

- **Client:** React App running in the browser. Handles state (`config`, `sessions`, `timetables`) and serializes data into a JSON payload.
- **Server:** Spring Boot API running on port 8080. Receives JSON, executes `TimetableMK.java`, and returns the solved schedule.

---

## **Algorithm & Logic**

The core logic resides in `TimetableMK.java` and follows a **Three-Step Process** :

1. **Session Splitting:** Separates "Pending" sessions from "Pre-placed" sessions.
2. **Validator (`checkAndLockPrePlaced`):** Iterates through user-locked sessions. If a user created a conflict manually, this returns `false` immediately (Fail Fast).
3. **Solver (`backtrack`):**

- Uses **Recursive Depth-First Search**.
- Utilizes **3D Boolean Arrays** (`facultyBusy[f][d][s]`) for conflict checking.

- Tries to place a session -> Checks Constraints (`canPlace`) -> Recurses.
- If a dead end is reached, it **Backtracks** (undoes the move) and tries the next option.

---

## **Setup & Installation**

### **Prerequisites**

- Java JDK 17 or higher
- Node.js & npm
- Maven

### **1. Backend Setup (Spring Boot)**

```bash
# Clone the repository
git clone <repo-url>
cd backend

# Build the project
mvn clean package

# Run the application
java -jar target/timetable-generator-0.0.1-SNAPSHOT.jar

```

_The server will start at `http://localhost:8080`._

### **2. Frontend Setup (React)**

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

```

_The app will run at `http://localhost:5173`._

---

## **API Reference**

### **Generate Timetable**

- **Endpoint:** `POST /api/timetable/generate`
- **Description:** Accepts configuration and session data, returns a solved timetable.

- **Request Body (JSON Example):**

```json
{
  "config": { "days": 5, "sessionsPerDay": 6 },
  "department": {
    "classes": ["IT-2A"],
    "rooms": ["K-203"],
    "faculty": ["ARK"]
  },
  "sessions": { ... },
  "timetables": { ... }
}

```

- **Response:**
- `200 OK`: Returns the completed timetable grid.
- `400 Bad Request`: Manual placement conflict detected.
- `500 Internal Error`: No valid timetable found.

---

## **Usage Workflow**

1. **Configuration:** Set working days (e.g., 5) and slots per day (e.g., 6).

2. **Department Setup:** Add all Classes, Faculty, Rooms, Labs, and Subjects.

3. **Session Definition:** Define course loads (e.g., "COA Lab" for "IT-2A" with faculty "ARK").

4. **Manual Placement (Optional):** Drag critical sessions to specific slots to lock them.

5. **Generate:** Click "Generate Timetable" to auto-fill the rest.

---

## **Future Scope**

- **Genetic Algorithm:** Implementing GA to handle university-scale datasets with soft constraints.

- **Database Persistence:** Integrating PostgreSQL to save user profiles and schedules permanently.

- **Asynchronous Processing:** Using RabbitMQ for handling long-running generation tasks without timeouts.

---

## **Team**

Developed by students of **Sarvajanik College of Engineering and Technology**:

- Himanshu Chabhadiya
- Shruti Desai
- Vishvam Joshi
- Rushil Kevadiya
- Jeel Maniya


