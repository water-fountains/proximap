# Roadmap

## Milestones

### 1. The scaffolding 
- [ ] Sketch out application API
  - what data does each component consume and in what format
  - what services need to be set up to provide the data
- [ ] Create a reactive scaffolding for the app 
  - [ ] decide which Angular UI to use, if any
  - [ ] create pages, menu bars, panels
  - [ ] link display to URL routes
  - [ ] make sure everything is responsive
- [ ] Implement language changing

### 2. The flesh
- [ ] Create a dummy dataset to work with
- [ ] Implement data management service
- [ ] Impement essential components
  - [ ] main menu
  - [ ] map
  - [ ] search list
  - [ ] mini detail view
  
### 3. Embellishments
- [ ] navigation
- [ ] full details view
- [ ] advanced search
- [ ] ...

## Components

The following points refer to areas and panels in the UI. Please refer to mockup [here](https://www.figma.com/proto/VtlRvM4aWOWYIEL2j7EcCeVk/water-fountains.org?scaling=contain&node-id=1%3A30).
- Menu bar: contains logo, search bar, information button, language selection and city selection 
- Map: interactive map where fountains, the user’s location, and navigation paths can be 
viewed. 
- List: list in which fountains are displayed and can be filtered (see 3c). The fountains are 
displayed in order of proximity to user (if user location available) or in alphabetical order. 
- Small information tab: when a fountain is selected, a summary of information about the 
fountain is displayed over the map. Information included in this tab depends on what is made 
available from the data sets, but it could include: 
  - Construction year of fountain (e.g. 1951) 
  - Type of water (e.g. Well water)  
  - Water quality (e.g. drinking water/not drinking water) 
- Detailed information window: provided more information about the fountain is available from 
Wikidata and/or Wikimedia, the detailed information window contains a detailed description 
and photos of the fountain. 
- Navigation pane: turn-by-turn instructions for how to get to a fountain. 
- Information pane: full-screen information about Zurich’s fountains and about the application. 
Lots of pointers to 
a) open data and open source concepts 
b) call for action 
b1) on content completion/extension 
b2) technical efforts to make even more open 