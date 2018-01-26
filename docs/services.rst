===================
Proximap components
===================

Map
---
Private Methods
...............
:code:`update()`
  This function updates the map to display desired information. It watches:
   - :code:`appManager.mode` to determine whether to show filtered fountains, a route, or just a single fountain
   - :code:`dataManager.fountains_filtered`, :code:`fountain_selected`, and :code:`route_data` in order to update the data displayed in the map

:code:`display_route(user_location, route_data)`
  If the app is in :code:`route` mode, this function displays the user's current location and the route on the map.

:code:`display_fountains(user_location, fountains_filtered)`
  If the app is in :code:`map` mode, this function displays the user's location and the filtered fountains on the map.

:code:`display_selected_fountain(fountain_selected)`
  If the app is in :code:`map` mode, this function displays the filtered fountains on the map.

:code:`select(fountain_id)`
  The user can select a fountain in the map. The function modifies the URL parameter accordingly

Public Methods
..............
:code:`refresh()`
  Force the map to refresh

Filter
------
- toggle_cat() *toggle category for filter*
- text_filter() *update text for search*

List
----
- update() *watches filtered data*
- select() *select a fountain*
- hide()
- show()

Navigation pane
---------------
- change_travel_mode()
- exit()
- hide()
- show()

Details pane
------------
- update()
- hide()
- show()
- route()
- show_partial()

Menu
----
- change_lang()
- show_info()
- change_city()