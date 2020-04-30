dist:
	mkdir spleeter-native && cp README.md spleeter-native/README.txt && cp spleeter-native.amxd spleeter-native/ && cp -r pretrained_models spleeter-native/ && cp *.js spleeter-native/ && zip -r spleeter-native spleeter-native/*
clean:
	rm -r spleeter-native/ && rm *.zip
