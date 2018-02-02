===========================
Application state variables
===========================

The following variables define the application state and are set in the url of the web page.

+---------------------+----------+--------+-------------------+---------+--------------------------------------------------------+
| state variable name | location | type   | example           | default | description                                            |
+=====================+==========+========+===================+=========+========================================================+
| city                | param    | string | zurich            | zurich  | city for which data is being shown                     |
+---------------------+----------+--------+-------------------+---------+--------------------------------------------------------+
| fountain_id         | var      | string | q72592            | none    | unique identifier for fountain selected, if any        |
+---------------------+----------+--------+-------------------+---------+--------------------------------------------------------+
| mode                | var      | string | map/details/route | map     | application mode (determines which panels are visible) |
+---------------------+----------+--------+-------------------+---------+--------------------------------------------------------+
| search_txt          | var      | string | kluspla           | none    | filter text                                            |
+---------------------+----------+--------+-------------------+---------+--------------------------------------------------------+
| search_cat          | var      | list   | [well, favorite]  | []      | filter categories that can be toggled on/off           |
+---------------------+----------+--------+-------------------+---------+--------------------------------------------------------+
| hide_list           | var      | bool   | true/false        | true    | in mobile mode, hide list by default                   |
+---------------------+----------+--------+-------------------+---------+--------------------------------------------------------+
| lang                | var      | string | en/de/fr          | en      | language of app                                        |
+---------------------+----------+--------+-------------------+---------+--------------------------------------------------------+

App state propagation
---------------------
A service watches the url parameters and updates the internal state variables.
The application data manager and view manager watch the state variables for changes and make modifications to the view
and data, respectively. Individual components watch the data for changes and update independently.