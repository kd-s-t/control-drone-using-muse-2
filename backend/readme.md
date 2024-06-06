Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process  
.\venv\Scripts\Activate.ps1  
uvicorn index:app --reload  