===================
Proximap components
===================

Note: Each component that is not always visible has a method to update its visibility based on the app state.

Map
---
The map is the main component of the app, and is always visible (though sometimes in the background).

Private Methods
...............
:code:`update()`
  This function updates the map to display desired information. It watches:
  :code:`appManager.mode` to determine whether to show filtered fountains, a route, or just a single fountain
  :code:`dataManager.fountains_filtered`, :code:`fountain_selected`, and :code:`route_data` in order to update the data displayed in the map

:code:`update_user_location(user_location)`
  This function displays the user's current location on the map.

:code:`display_route(route_data)`
  If the app is in :code:`route` mode, this function displays the route on the map.

:code:`display_fountains(fountains_filtered)`
  If the app is in :code:`map` mode, this function displays the filtered fountains on the map.

:code:`display_selected_fountain(fountain_selected)`
  If the app is in :code:`details` mode, this function displays the selected fountain on the map.

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

 .. image:: images/components/search.png
   :width: 200 px
   :align: right

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

 .. image:: images/components/list_pane.png
   :width: 200 px
   :align: right

Features
........
Sort list elements by proximity, name, or construction date.

Private Methods
...............
:code:`update()`
  This function updates the list when the :code:`fountains_filtered` data in the dataManager has been modified. It is triggered by a subscription to that data.

Public Methods
..............
:code:`select(fountain_id)`
  The user can select a fountain in the list. The function modifies the URL parameter accordingly.


Navigation pane
---------------
[low priority] This pane shows step-by-step navigation instructions.

 .. image:: images/components/nav_pane.png
   :width: 200 px
   :align: right

Private Methods
...............
:code:`update()`
  This function updates the route info when the :code:`route_data` data in the dataManager has been modified. It is triggered by a subscription to that data.

Public Methods
..............
:code:`change_travel_mode(new_mode)`
  Updates travel mode.

Details pane
------------
This pane displays information about the selected fountain. Information included in this pane depends on what is made available from the data sets, but it could include:
- Construction year of fountain (e.g. 1951)
- Type of water (e.g. Well water)
- Water quality (e.g. drinking water/not drinking water)
The pane also shows information available from Wikidata and/or Wikimedia, including a detailed description and photos of the fountain.

 .. image:: images/components/details.png
   :width: 200 px
   :align: right

Private Methods
...............
:code:`update()`
  This function updates the displayed information when the :code:`fountain_selected` data in the dataManager has been modified. It is triggered by a subscription to that data.

Public Methods
..............
:code:`show_route()`
  This function changes the mode of the app to :code:`route` and triggers a route search between the user's current location and the selected fountain. The route search is managed in the dataManager.


Menu
----
The menu bar contains logo, search bar, information button, language selection and city selection. On mobile devices it is replaced with a menu button and slide-out menu on the right.


Public Methods
..............
:code:`change_lang(new_lang)`
  This function changes the language of the app.

:code:`change_city(new_city)`
  This function changes the city of the app.
