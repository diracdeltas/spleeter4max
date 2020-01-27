dist:
	mkdir spleeter && cp README.md spleeter/README.txt && cp -r pretrained_models spleeter/ && cp spleeter.amxd spleeter/ && cp *.js spleeter/ && zip -r spleeter spleeter/*
clean:
	rm -r spleeter/ && rm *.zip
