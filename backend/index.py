from fastapi import FastAPI, WebSocket
from pylsl import StreamInlet, resolve_stream
import numpy as np
from scipy.fftpack import fft
import asyncio

app = FastAPI()

# Initialize global variables
freq_bands = {
    'Delta': (0.5, 4), 
    'Theta': (4, 8), 
    'Alpha': (8, 13), 
    'Beta': (13, 30), 
    'Gamma': (30, 100)
}
band_powers = {band: {'power': 0, 'range': (low, high)} for band, (low, high) in freq_bands.items()}
window_size = 256
sampling_rate = 256  # Adjust to your actual sampling rate
data_buffer = np.zeros(window_size)

def compute_band_powers(data, sampling_rate):
    fft_result = np.abs(fft(data))**2
    freqs = np.fft.fftfreq(len(data), 1.0/sampling_rate)
    
    for band, (low, high) in freq_bands.items():
        band_power = np.mean([fft_result[i] for i in range(len(freqs)) if low <= abs(freqs[i]) <= high])
        band_powers[band]['power'] = band_power
        print(f"Computed {band} power: {band_power}")  # Add logging

async def stream_eeg_data(websocket: WebSocket):
    print("Looking for an EEG stream...")
    streams = resolve_stream('type', 'EEG')
    inlet = StreamInlet(streams[0])
    print("Successfully connected to the EEG stream.")
    
    while True:
        sample, timestamp = inlet.pull_sample()
        
        # Update the data buffer
        global data_buffer
        data_buffer = np.roll(data_buffer, -1)
        data_buffer[-1] = sample[0]  # Assuming we're only interested in the first channel

        # Compute frequency band powers
        compute_band_powers(data_buffer, sampling_rate)

        # Send data to the client
        await websocket.send_json(band_powers)
        await asyncio.sleep(0.1)

@app.websocket("/ws/eeg")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        await stream_eeg_data(websocket)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await websocket.close()
