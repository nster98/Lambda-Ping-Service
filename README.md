# Lambda-Ping-Service
Uses AWS Lambda to ping URLs for valid response codes, and sends webhook notifications if an error is found to external services

![license](https://img.shields.io/github/license/nster98/Lambda-Ping-Service?style=flat-square)

## Installation
Use npm to install required packages
```bash
npm install request async express
```
## Usage
Requires JSON file with following fields:
```json
{
	"url": <url>, 				// URL to ping
	"method": <GET or POST>, 	// HTTP method
	"payload": {},				// Payload to send to POST, can be empty
	"validResponse": <Code>,	// Valid Response from the URL requested
	"errorNotification": []		// Array of webhooks to notify
}
```
//As of 7/30/20
To run, run the command
```bash
npm run test
```

## Contributing
This project is open to forks and contribution
