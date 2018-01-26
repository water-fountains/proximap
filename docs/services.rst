Proximap services
=================
The following services work in the background of the app:

App manager
-----------
Properties
~~~~~~~~~~
The application's state is stored in an object. See `application state variables <application state variables.rst>`_ for complete list of state properties.

Methods
~~~~~~~
parse_url()
  Checks and corrects url params and variables, and updates app state variables accordingly. If a variable is not provided, default
  values are used.

update_panes()
  update app pane visibility according to app mode and other variables.


Data manager
------------
Properties
~~~~~~~~~~
Properties store the data.
Data
....
fountains
  All fountains of selected city.

fountains_filtered
  filtered fountains.

fountain_selected
  fountain selected by user.

user_location
  coordinates

user_preferences
  user preferences, like preferred mode of transport

route_data
  routing data as acquired by routing service

Methods
~~~~~~~
- fetch_city_data()
- fetch_route()
- filter_data