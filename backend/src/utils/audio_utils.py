import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

import librosa
import librosa.display
import numpy as np
import os


def mp3_to_spectogram(file, file_id):
    file.save("test.mp3")
    # Load the audio file
    audio_path = 'test.mp3'
    y, sr = librosa.load(audio_path)

    # Compute the spectrogram
    spectrogram = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)

    # Convert to dB scale
    spectrogram_db = librosa.power_to_db(spectrogram, ref=np.max)

    # Visualize the spectrogram
    plt.figure(figsize=(20, 2))
    librosa.display.specshow(spectrogram_db, x_axis='time', y_axis='mel', sr=sr, fmax=8000)
    plt.colorbar(format='%+2.0f dB')
    #plt.title('Mel-frequency spectrogram')
    num_seconds = int(len(y) / sr)
    #plt.xticks([1, 2, 3, 4, 5, 6])
    num_ticks = num_seconds + 1
    tick_locations = np.linspace(0, num_seconds, num_ticks)
    plt.xticks(tick_locations)
    plt.grid()
    #plt.axis('off')
    filepath = f'static/temp/{file_id}.jpg'
    plt.savefig(filepath, bbox_inches='tight')

    os.remove("test.mp3")

    return filepath
