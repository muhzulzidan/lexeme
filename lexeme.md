
# Modification Requirements

I need some modification on this next js repo https://github.com/pagebrain/lexeme. Link for trial: https://pagebrain.ai/lexeme/editor Please try it out first before continue to understand better.

1. Delete button

I need a delete button for each of this list. Should show a confirmation before deleting. 

2. Copy button

I need a copy button to copy everything inside the editor. Should show a toast/notification when copied.

3. Session system

I need the app to support a unique session. For example if i access the app with https://pagebrain.ai/lexeme/editor/ab776ec78d77e99b2 The "ab776ec78d77e99b2" will be a unique identifier that save everything the session do.

The app already have this export import feature. Please try it first if you haven't. When exporting, it gives us a json file and if we import the json file, it will load all the data contained.

So my idea is to mimic this export import feature. Maybe save the json into the database whenever there is any change of settings, editor, prompts, etc, it will save to database with this id "ab776ec78d77e99b2".

So if later i close the app and i access https://pagebrain.ai/lexeme/editor/ab776ec78d77e99b2, it will load the data from database just like import feature.

Note:

* Remove the export and import button
* If there is no existing data, then it will save the data into the database
