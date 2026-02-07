from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/patient", response_class=HTMLResponse)
async def read_patient(request: Request):
    return templates.TemplateResponse("patient.html", {"request": request})

@app.get("/doctor", response_class=HTMLResponse)
async def read_doctor(request: Request):
    return templates.TemplateResponse("doctor.html", {"request": request})

@app.get("/staff", response_class=HTMLResponse)
async def read_staff(request: Request):
    return templates.TemplateResponse("staff.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def read_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})
