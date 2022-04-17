# Deliveready
Thank you for viewing our application! 

Here's how to get started! 
- git clone the project into a folder of your choice
- set up a virtual environment for the project and start it (for more infor you can visit: https://www.javatpoint.com/django-virtual-environment-setup)
- start the virtual environment
- make sure you pip installed
- run the following commands: 
    -   pip install django
    -   pip install djangorestframework
    -   pip install -r requirements.txt

- now, you can run the server:
  - python manage.py runserver

- You are ready to use the application!

#Users
There are two types of users: admin users and customer users. 
The application sign up form will create a customer user. To create an admin user, go to {localhost:}/admin/.

#Ingredients for use in Recipe
Before starting the project, create Ingredient options for the app to use from your local database. 
You can either use SQL statements in Postgres applications or directly on the django shell.
Example steps in django shell, run these in virtual environment: 
  - python manage.py shell
  - from ingredients.models import Ingredient
  - avocado = Ingredient.objects.create(name="Avocado", quantity=1, quantity_unit="whole", price=2.49, filename_url="images/filename_url")
Now, avocado is an available ingredient for you to use in a recipe! You can build a recipe now in the Recipe Portal for an admin user. 
Ingredients can now be added to your pantry as well. 
Once ingredients have been added and recipes have been created, the homepage will look like this. 
Upon clicking individual recipes, you can add their ingredients to your cart. 
When checking out the cart, the order will be confirmed and then available for you to view on Orders Page.

<img width="765" alt="homepage" src="https://user-images.githubusercontent.com/60757186/163730205-07043062-faf8-411d-89b8-7bbbabd1a60c.PNG">

Happy Cooking! 
