# Windows
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process  
.\venv\Scripts\Activate.ps1  
uvicorn index:app --reload  

# Macm1


# Raspberry pi 4 B
source venv/bin/activate   
uvicorn index:app --reload  
muselsl stream

