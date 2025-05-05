# Troubleshooting Frontend-Backend Connection Issues

## Problem Description

When running the frontend application (React/Vite on `http://localhost:5173`) and the backend API (FastAPI on `http://localhost:8000`), the frontend failed to fetch data from the backend. The browser's developer console showed **CORS (Cross-Origin Resource Sharing) errors**, similar to this:

```
Access to XMLHttpRequest at 'http://localhost:8000/clusters' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

This indicates that the backend server was not configured to allow requests originating from the frontend's domain (`http://localhost:5173`).

## Resolution Steps

1.  **Verify Backend CORS Configuration:**
    *   We checked the backend code in `backend/app/main.py`.
    *   It was confirmed that the FastAPI application already included `CORSMiddleware` with `allow_origins=["*"]`. This setting *should* allow requests from any origin, including our frontend.

    ```python
    # filepath: backend/app/main.py
    # ...
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # Allows any origin
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # ...
    ```

2.  **Attempt Backend Server Restart:**
    *   Since the CORS configuration seemed correct, the next step was to ensure the backend server was running with the latest code.
    *   Attempting to restart the Uvicorn server using `uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000` resulted in a new error:
        ```
        ERROR:    [Errno 48] Address already in use
        ```
    *   This indicated that another process was already bound to port 8000, preventing the new server instance from starting.

3.  **Identify and Terminate Conflicting Process:**
    *   To find the process using port 8000, the following command was used in the terminal:
        ```bash
        lsof -i :8000
        ```
    *   The output identified the Process ID (PID) of the conflicting process (in this case, it was `24935`).
    *   To terminate this process, the following command was used:
        ```bash
        kill -9 24935
        ```
        *(Replace `24935` with the actual PID if encountered again)*.

4.  **Successfully Restart Backend Server:**
    *   After terminating the conflicting process, the backend server was successfully restarted:
        ```bash
        uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
        ```

## Conclusion

The initial CORS error observed in the browser was likely due to either the backend server not running correctly or an older instance occupying the required port. By identifying and stopping the conflicting process and restarting the backend server with the correct CORS configuration already in place, the communication issue between the frontend and backend was resolved.