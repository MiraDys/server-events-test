# Server Events Test MONOREPO

This is a monorepo for testing server-sent events functionality.

- SSE streaming
- Websocket

TODO:

- [] add tests
- [] dockerize
- [] host

## Backend Requirements

- Python 3.10+
- FastAPI
- Uvicorn
- Uvicorn[standard]

## Frontend Requirements

- node 20+
- npm 10+

## Use locally

1. Clone the repo
   git clone https://github.com/MiraDys/server-events-test.git

2. Install Frontend dependency  
   `cd server-events-frontend`  
   `npm install`  
   `npm run dev`

3. Install Backend dependency  
   `cd backend`  
   `pip install -r requirements.txt`

4. Run the backend  
   `python sse-backend.py`  
   `python websocket-backend.py`

5. Open the frontend in a browser
   http://localhost:3000/

## License

MIT License
