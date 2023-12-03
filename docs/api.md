# API Documentation

> All requests and responses are encoded in JSON.

# User Authentication

## Sign Up

Signs up to the API

```http
POST https://{baseUrl}/v1/auth/sign-up HTTP/1.1
```

```bash
curl --location --request POST 'https://{baseUrl}/v1/auth/sign-up' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Your Name' \
--data-urlencode 'emailAddress=name@example.com' \
--data-urlencode 'password=EnterYourPassword'
```

|   Parameter   |   Conditions   |   in   |   Description   |
|---------------|----------------|--------|-----------------|
| name   | required | body | Your full name |
| emailAddress | required, unique | body | Your email address. It must be unique. |
| password | required | body | Your password. Must have a minimum length of 8 and a maximum length of 32 |

## Sign In

Sign in to the API

```http
POST https://{baseUrl}/v1/auth/sign-in HTTP/1.1
```

```bash
curl --location --request POST 'https://{baseUrl}/v1/auth/sign-in' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'emailAddress=name@example.com' \
--data-urlencode 'password=EnterYourPassword'
```

|   Parameter   |   Conditions   |   in   |   Description   |
|---------------|----------------|--------|-----------------|
| emailAddress | required, unique | body | Your email address. |
| password | required | body | Your password. |

# OAuth

To get an OAuth token. You'll need to create an application and use the provided `client_id` and `client_secret` to get an access token.

```http
POST https://{baseUrl}/oauth/access_token
```

```bash
curl --location --request POST 'https://{baseUrl}/oauth/access_token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=EnterYourClientId' \
--data-urlencode 'client_secret=EnterYourClientSecret'
```

|   Parameter   |   Conditions   |   in   |   Description   |
|---------------|----------------|--------|-----------------|
|grant_type|required|body|We only support `client_credentials` grant type as of now.|
|client_id|required|body|Client id|
|client_secret|required|body|Client secret|

# Users

> Requires `Bearer` token passed in `Authorization` header.

## Create a user

`POST https://{baseUrl}/v1/users`

```bash
curl --location --request POST 'https://{baseUrl}/v1/users' \
--header 'Authorization: Bearer YourAccessToken' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Your Name' \
--data-urlencode 'emailAddress=name@example.com' \
--data-urlencode 'password=EnterYourPassword' \
--data-urlencode 'role=Your Role' \
--data-urlencode 'status=Your Status'
```

|   Parameter   |   Conditions   |   in   |   Description   |
|---------------|----------------|--------|-----------------|
|name|required|body|Name of the new user|
|emailAddress|required|body|Email address of the new user|
|password|required|body|Password of the new user|
|role|optional|body|Role of the new user. Defaults to `SuperAdmin` if none is provided. Possible values are `SuperAdmin`, `StaffAdmin` and `ManagerAdmin`|
|status|optional|body|Status of the user. Defaults to `Active` if none is provided. Possible values are `Active`, `Inactive` and `Banned`|

## Get a list of users

Returns a list of users

`GET https://{baseUrl}/v1/users`

```bash
curl --location --request GET 'https://{baseUrl}/v1/users' \
--header 'Authorization: Bearer YourAccessToken'
```

## Get a single user

Returns a single user

`GET https://{baseUrl}/v1/users/{userId}`

```bash
curl --location --request GET 'https://{baseUrl}/v1/users/1' \
--header 'Authorization: Bearer YourAccessToken'
```

## Update a user

`PUT https://{baseUrl}/v1/users/{userId}`

```bash
curl --location --request PUT 'https://{baseUrl}/v1/users/1' \
--header 'Authorization: Bearer YourAccessToken' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Your Name' \
--data-urlencode 'emailAddress=name@example.com' \
--data-urlencode 'password=EnterYourPassword' \
--data-urlencode 'role=Your Role' \
--data-urlencode 'status=Role Status'
```

|   Parameter   |   Conditions   |   in   |   Description   |
|---------------|----------------|--------|-----------------|
|name|required|body|Name of the new user|
|emailAddress|required|body|Email address of the new user|
|password|required|body|Password of the new user|
|role|optional|body|Role of the new user. Possible values are `SuperAdmin`, `StaffAdmin` and `ManagerAdmin`. Defaults to `SuperAdmin` if none is provided.|
|status|optional|body|Status of the user. Defaults to `Active` if none is provided. |

## Update a user's role

Updates the role of a user

`PUT https://{baseUrl}/v1/users/{userId}/role`

```bash
curl --location --request PUT 'https://{baseUrl}/v1/users/1/role' \
--header 'Authorization: Bearer YourAccessToken' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'role=Your Role'
```

|   Parameter   |   Conditions   |   in   |   Description   |
|---------------|----------------|--------|-----------------|
|role|required|body|Role of the new user. Possible values are `SuperAdmin`, `StaffAdmin` and `ManagerAdmin`|

## Update a user's status

Updates the status of a user

`PUT https://{baseUrl}/v1/users/{userId}/status`

```bash
curl --location --request PUT 'https://{baseUrl}/v1/users/1/status' \
--header 'Authorization: Bearer YourAccessToken' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'status=Your Status'
```

|   Parameter   |   Conditions   |   in   |   Description   |
|---------------|----------------|--------|-----------------|
|status|required|body|Status of the user. Possible values are `Active`, `Inactive` and `Banned`|

## Delete a user

Deletes a user

`DELETE https://{baseUrl}/v1/users/1`

```bash
curl --location --request DELETE 'https://{baseUrl}/v1/users/1' \
--header 'Authorization: Bearer YourAccessToken'
```

# Applications

> Requires `Bearer` token passed in `Authorization` header.

## Create an application

Creates an application.

`POST https://{baseUrl}/v1/applications`

```bash
curl --location --request POST 'https://{baseUrl}/v1/applications' \
--header 'Authorization: Bearer YourAccessToken' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Example Application' \
--data-urlencode 'homepage=https://example.com' \
--data-urlencode 'description=Your description goes here' \
--data-urlencode 'status=Active'
```

|   Parameter   |   Conditions   |   in   |   Description   |
|---------------|----------------|--------|-----------------|
|name|required|body|Name of the application|
|homepage|optional|body|Homepage of the application|
|description|optional|body|Description of the application|
|status|optional|body|Status of the application. Possible values are `Active`, `Inactive` and `Banned`|

## Get a list of applications

Returns a list of applications

`GET https://{baseUrl}/v1/applications`

```bash
curl --location --request GET 'https://{baseUrl}/v1/applications' \
--header 'Authorization: Bearer YourAccessToken'
```

## Get a single application

Returns a single application

``GET https://{baseUrl}/v1/applications/{applicationId}`

```bash
curl --location --request GET 'https://{baseUrl}/v1/applications/{applicationId}' \
--header 'Authorization: Bearer YourAccessToken'
```

## Update an application

Updates an application

`PUT https://{baseUrl}/v1/applications/{applicationId}`

```bash
curl --location --request PUT 'https://{baseUrl}/v1/applications/93' \
--header 'Authorization: Bearer YourAccessToken' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Application Name' \
--data-urlencode 'homepage=https://example.com' \
--data-urlencode 'description=Description goes here'
```

## Update an application's credentials

Updates an application's credentials

`PUT https://{baseUrl}/v1/applications/{applicationId}/credentials`

```bash
curl --location --request PUT 'https://{baseUrl}/v1/applications/{applicationId}/credentials' \
--header 'Authorization: Bearer YourAccessToken'
```

## Deletes an application

Deletes an application

`DELETE https://{baseUrl}/v1/applications/{applicationId}`

```bash
curl --location --request DELETE 'https://{baseUrl}/v1/applications/93' \
--header 'Authorization: Bearer YourAccessToken'
```
