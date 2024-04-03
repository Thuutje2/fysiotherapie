import dash
from dash import dcc, html
import pandas as pd
import plotly.express as px

# Lees het CSV-bestand in
df = pd.read_csv("csv/mediapipe_body_3d_xyz.csv", sep=',')

# Initialiseer de Dash-applicatie
app = dash.Dash(__name__)
app.title = "Mijn Dashboard Applicatie"


# Functie om de kolomnamen op te schonen
def clean_column_names(columns):
    return [col.replace("'", "").replace(",", "") for col in columns]


# Opties voor dropdown-menu
options = [{'label': col, 'value': col} for col in clean_column_names(df.columns)]

# Layout van de app
app.layout = html.Div([
    # Sidebar met menu
    html.Div([
        html.H2("Menu", className="display-4"),
        html.Hr(),
        html.P("Welkom, Gebruiker!"),
        html.Hr(),
        html.H5("Informatie:"),
        html.P("Hier komt informatie voor de gebruiker."),
    ],
        style={
            "position": "fixed",
            "top": 0,
            "left": 0,
            "bottom": 0,
            "width": "15%",
            "padding": "10px",
            "background-color": "#f8f9fa",
        }),

    # Hoofdinhoud met dropdown en grafiek
    html.Div([
        html.H2("Dashboard", className="display-4"),
        html.Hr(),
        html.Label("Selecteer een kolom:"),
        dcc.Dropdown(
            id='column-dropdown',
            options=options,
            value=options[0]['value']
        ),
        html.Div(id='graph-container')
    ],
        style={"margin-left": "15%", "padding": "20px"}),
])


# Callback functie om de grafiek bij te werken
@app.callback(
    dash.dependencies.Output('graph-container', 'children'),
    [dash.dependencies.Input('column-dropdown', 'value')]
)
def update_graph(selected_column):
    # Maak een figuur met Plotly Express
    fig = px.line(df, x=df.index, y=selected_column, title=f"Grafiek van {selected_column}")
    # Maak een dcc.Graph object en geef het terug
    return dcc.Graph(figure=fig)


# Start de Dash-applicatie
if __name__ == '__main__':
    app.run_server(debug=True)













