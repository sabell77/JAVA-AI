| Method | URL | Status Code | Response Type | What Happened? |
|---|---|---:|---|---|
| GET | http://localhost:8080/api/courses | 200 OK | List | **Success:** The server successfully retrieved all course entries. The response payload contains a JSON array listing every course object available in the database. |
| GET | http://localhost:8080/api/courses/C001 | 200 OK | Single object | **Success:** The server matched the unique identifier C001 and returned exactly one specific course object containing its details (title, instructor, etc.). |
| GET  | http://localhost:8080/api/courses/C999 | 404 Not Found | Error object | **Failure:** The client requested a resource identifier that does not exist. The server returned a 404 error payload detailing that the course was not located. |
| POST | http://localhost:8080/api/courses | 201 Created | Single object | **Success:** A valid JSON payload was sent in the request body. The server validated it, wrote it to the database, and returned the newly generated resource object. |
| POST | http://localhost:8080/api/courses | 400 Bad Request | Error object | **Failure:** The request body left out a mandatory database field (e.g., missing courseName). The server halted processing and rejected it with a validation error. |

**1. Which request returned a successful list response?**

    The GET http://localhost:8080/api/courses request. Because it targeted the root collection endpoint without specifying an ID parameter, the server returned an array ([...]) containing all available resource entries accompanied by a 200 OK status code.

**2. Which request returned a not-found response?**

    The GET http://localhost:8080/api/courses/C999 request. The server successfully processed the request structure but could not locate any entity matching the ID C999 in its database, resulting in a 404 Not Found response.

**3. Which request returned a validation error?**

    The second POST request targeting http://localhost:8080/api/courses. It failed because the submitted data payload was malformed or missing required constraints, triggering a 400 Bad Request validation map explaining exactly which criteria failed.

**4. What is the difference between a successful response and an error response?**

    • Successful Responses (2xx Range): 
    Indicate that the client's intent was fulfilled. The response payload returns the actual target data (such as a requested list or newly saved object) or a clean confirmation.

    • Error Responses (4xx/5xx Range): 
    Indicate that something went wrong. The server shifts its layout to return an error schema (frequently containing properties like "timestamp", "status", "error", or "message") describing what failed so the client can correct its behavior.

**5. Why is the status code important for frontend developers?**

    Status codes provide an immediate, structured way for frontend JavaScript programs to determine the outcome of a network request before parsing any response data.

    Instead of reading text strings, the frontend checks numerical ranges (e.g., if response.ok or status === 201). This lets the app instantly decide how to update the user interface—such as navigating to a new screen on success, or launching specific alert boxes during validation failures.

**What is one thing you understand better about REST after this exercise?**

HTTP methods and status codes form a strict, universal grammar between systems. Seeing a 201 Created status return with a specific schema completely separated from a regular 200 OK showed me how much structural intelligence is built directly into web communication. It makes me realize how straightforward handling these states in JavaScript using fetch() will be now that I know how to read what the server is saying under the hood.