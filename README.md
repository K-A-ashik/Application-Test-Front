# Application-Test-Front
###### This projects enables user to create, update and delete order's.

## Frontend :
###### Fronted is writen using below technical specifications :  
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.1.
Node: 18.12.1  
typescript : 4.9.4  

- I have impletemented the Data table using **AG Grid**
- **Order Edit** is available in inline and **Add** is available in **Modal**.
- In angular service is impletemented with **GET, POST, PUT** And **DELETE** methods.
- The response is returned as **json** and processed using **Observable**.
- The data is read and displayed in the Ag Grid.
- I also allowed option to edit the order data **inline** as well.
- The passig the data between components are implemented in the **user form**
- I have also implemented the custom toaster which is helpfull in showing alert notification. I have also use change detection strategy onPush.

## Frontend Test description 
###### I am using Jasmin and Karma as a testing tool for the frontend Angular.
- There are **unit test** available in each component.
- To test the service I have implemented the **mock service Unit Test** in api.service.spec.ts file.
- I have also writen **Form Validation Unit Test** for the order form.
- There are also unit test available for toast component and toast as a service.

Run ```ng test``` to exicute the test. which will give you all the above mentioned test cases.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Development server
In console navigate to your project folder and run ```ng serve --open``` which will create a local server on the localhost with the default port number ```http://localhost:4200/```. The application will automatically reload if you change any of the source files.

## Production server
Run ```ng build``` which will create a build folder named ```dist/``` at the project root.

## Further help
To get more help on the Angular CLI use ```ng help``` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.