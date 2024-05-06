# grab the node image
FROM node:alpine AS base

# move to working directory
WORKDIR /usr/src/app

# copy everything to that working directory
COPY . /usr/src/app

# install the dependencies and node_modules for ng servve
RUN npm install -g @angular/cli
RUN npm install

# this is what ng serve will run on
EXPOSE 4200

# run using ng serve; I believe this is a bad practice but I am not familiar with static files as they seem different from what I remember
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]

#---------------------------------------------------------------------------------------------

# # create the static files for our app that will end up in dist/frontend
# RUN npm run build --prod

# # now use nginx to host our static files
# FROM nginx:alpine AS host

# # copy the output of the npm run build --prod for nginx to use
# COPY --from=base /usr/src/app/dist/frontend /usr/share/nginx/html