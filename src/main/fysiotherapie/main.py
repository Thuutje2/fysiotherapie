import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.express as px

# Lees het CSV-bestand in
df = pd.read_csv("csv/mediapipe_body_3d_xyz.csv", sep=',')


# Initialiseer de Dash-applicatie met suppress_callback_exceptions=True
# dit wordt gebruikt om te voorkomen dat de app crasht als er een fout optreedt in een callback.
app = dash.Dash(__name__, suppress_callback_exceptions=True)
app.title = "Mijn Dashboard Applicatie"

# Functie om de kolomnamen op te schonen
def clean_column_names(columns):
    return [col.replace("'", "").replace(",", "") for col in columns]

# Opties voor dropdown-menu
options = [{'label': col, 'value': col} for col in clean_column_names(df.columns)]

# Stijlen
menu_style = {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "bottom": 0,
    "width": "15%",
    "padding": "10px",
    "background-color": "#f8f9fa",
}

content_style = {
    "margin-left": "15%",
    "padding": "20px",
    "margin-top": "50px",
}

link_style = {
    "color": "black",
    "text-decoration": "none",
    "font-size": "1.2em",
    "display": "block",
    "padding": "5px",
    "border-radius": "5px",
    "margin-top": "5px",
    "margin-bottom": "5px",
    "background-color": "#e3e6e8",
}

keyword_style = {
"color": "black",
    "text-decoration": "none",
    "font-size": "1.2em",
    "display": "block",
    "padding": "5px",
    "border-radius": "5px",
    "margin-top": "5px",
    "margin-bottom": "5px",
    "font-weight": "bold",
}

# Layout van de app voor de hoofdpagina
def main_layout():
    return html.Div([
        # Sidebar met menu
        html.Div([
            html.P(dcc.Link("Dashboard", href='/', className='menu-link', style=keyword_style)),
            html.Hr(),
            html.P("Welkom, Gebruiker!"),
            html.Hr(),
            html.H3("Navigatie:"),
            html.P([
                dcc.Link("Toon Grafiek", href='/graph', className='menu-link', style=link_style),
                html.Br(),
            ]),
        ], style=menu_style),
        # Hoofdinhoud
        html.Div([
            html.H2("Welkom", className="display-4"),
            html.Hr(),
            html.P("Dit is de hoofdpagina van de applicatie."),
        ], style=content_style),
    ])

# Layout van de app voor de grafiekpagina
def graph_layout():
    return html.Div([
        # Sidebar met menu
        html.Div([
            html.P(dcc.Link("Dashboard", href='/', className='menu-link', style=keyword_style)),
            html.Hr(),
            html.P("Welkom, Gebruiker!"),
            html.Hr(),
            html.H3("Navigatie:"),
            html.P([
                dcc.Link("Toon Grafiek", href='/graph', className='menu-link', style=link_style),
            ]),
        ], style=menu_style),
        # Grafiek
        html.Div([
            html.H3("Grafiek", className="display-4"),
            html.Hr(),
            html.Label("Selecteer een kolom:"),
            dcc.Dropdown(
                id='column-dropdown',
                options=options,
                value="Kies een kolom",
            ),
            html.Div(id='graph-container'),
        ], style=content_style),
    ])

# Callback functie om de grafiek bij te werken
@app.callback(
    Output('graph-container', 'children'),
    [Input('column-dropdown', 'value')],
    prevent_initial_call=True
)
def update_graph(selected_column):
    # Maak een figuur met Plotly Express
    fig = px.line(df, x=df.index, y=selected_column, title=f"Grafiek van {selected_column}")
    # Maak een dcc.Graph object en geef het terug
    return dcc.Graph(figure=fig)


# Routing
@app.callback(
    Output('page-content', 'children'),
    [Input('url', 'pathname')]
)
def display_page(pathname):
    if pathname == '/':
        return main_layout()
    elif pathname == '/graph':
        return graph_layout()
    else:
        return '404'

# Start de Dash-applicatie
if __name__ == '__main__':
    app.layout = html.Div([dcc.Location(id='url', refresh=False), html.Div(id='page-content')])
    app.run_server(debug=True)




















