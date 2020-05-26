dist:
	mkdir spleeter && cp README.md spleeter/README.txt && cp -r pretrained_models spleeter/ && cp spleeter.amxd spleeter/ && cp *.js spleeter/ && zip -r spleeter spleeter/* && cp -r node_modules spleeter/node_modules
clean:
	rm -r spleeter/ && rm *.zip
