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
:code:`parse_url()`
  Checks and corrects url params and variables, and updates app state variables accordingly.

:code:`update_state(variable_name, new_value)`
  Updates the state variable, first checking if the new value is valid. If so, the app state variables are updated and the URL is updated as well.


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

Actions
~~~~~~~
- fetch_fountain_data()
- fetch_route()
- filter_data()
- set_fountain()
- geolocate_user()
- set_user_location()