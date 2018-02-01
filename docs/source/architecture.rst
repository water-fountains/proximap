=====================
ProxiMap Architecture
=====================

-------------------------
State and Data Management
-------------------------
Application State and Data is managed by a service, the stateManager and dataManager. The flow of information is uni-directional:
Events trigger state changes which can trigger data changes (or not). The components watch the state and data for changes and react accordingly.

.. image:: ../images/DataFlow.svg

Changes to make
---------------
- Adjust data management pattern to use Redux
- Linking the Redux store to the router can be done with: https://github.com/angular-redux/router

