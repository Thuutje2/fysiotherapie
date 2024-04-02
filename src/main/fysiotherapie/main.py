import tkinter as tk
from tkinter import ttk
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg


# Functie om de kolomnamen op te schonen
def clean_column_names(columns):
    return ' '.join(columns).replace("'", "").replace(",", "")


# Lees het Excel-bestand in met het juiste scheidingsteken (;)
df = pd.read_csv("csv/mediapipe_body_3d_xyz.csv", sep=',')

# Initialiseer de Tkinter-applicatie
root = tk.Tk()
root.title("Mijn Dashboard Applicatie")


# Functie om de grafiek bij te werken
def update_graph(event=None):
    selected_column = combo_box.get().strip()  # Verwijder extra spaties

    # Maak een figuur en assen-object aan om de grootte van de afbeelding te kunnen aanpassen
    fig, ax = plt.subplots(figsize=(10, 6))  # Pas de grootte van de afbeelding aan

    ax.plot(df.index, df[selected_column])  # Plot geselecteerde kolom tegen index

    ax.set_xlabel('Index')  # X-as label
    ax.set_ylabel(selected_column)  # Y-as label
    ax.set_title(f"Grafiek van {selected_column}")  # Titel

    # Maak een FigureCanvasTkAgg object aan en voeg het toe aan het Tkinter-venster
    canvas = FigureCanvasTkAgg(fig, master=root)
    canvas.draw()
    canvas.get_tk_widget().grid(row=2, columnspan=2, padx=10, pady=10)  # Plaats de grafiek in het venster


# Beschikbare kolommen zonder aanhalingstekens en komma's
cleaned_columns = clean_column_names(df.columns)

# Label
label = ttk.Label(root, text="Selecteer een kolom:")
label.grid(row=0, column=0, padx=10, pady=10)

# Dropdown-menu
combo_box = ttk.Combobox(root, values=cleaned_columns)
combo_box.grid(row=0, column=1, padx=10, pady=10)
combo_box.bind("<<ComboboxSelected>>", update_graph)

# Knop
button = ttk.Button(root, text="Toon grafiek", command=update_graph)
button.grid(row=1, columnspan=2, padx=10, pady=10)

# Start de Tkinter event loop
root.mainloop()













