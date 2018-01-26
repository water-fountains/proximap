===================
Proximap components
===================

Map
---
The map is the main component of the app, and is always visible (though sometimes in the background).

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

Public Methods
..............
Public methods can be called from the DOM or from other components/services.

:code:`select(fountain_id)`
  The user can select a fountain in the map. The function modifies the URL parameter accordingly.

:code:`set_user_location(coordinates)`
  The user can set their location via the map as an alternative to automatic localization.

:code:`refresh()`
  Force the map to refresh

Search
------
The search filter is accessed in the menu, floating over the map or at the top of the list (to be defined). It just allows easy modification of the fountain search criteria via the URL variables.

Private Methods
...............
Question: are the styles directly bound to the app state variables?

Public Methods
..............
:code:`toggle_cat(category_name, value)`
  This toggles a category for the filter in the :code:`search_cat` state variable. Examples of categories are:
   - `well`: fountains with wellwater
   - `historical`: fountains of historical value.

:code:`text_filter(search_text)`
  Updates the full text for search in the :code:`search_txt` state variable. Beware to sanitize the text!.

:code:`reset_filters()`
  Removes all filters.

List
----
Private Methods
...............
:code:`update()`
  This function updates the list when the :code:`fountains_filtered` data has been modified. It is triggered by a subscription to that data.

Public Methods
..............
:code:`select(fountain_id)`
  The user can select a fountain in the list. The function modifies the URL parameter accordingly.


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