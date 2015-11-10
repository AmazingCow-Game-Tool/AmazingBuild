
################################################################################
## Tests 																	  ##
################################################################################
#Test all...
test: test_2DToolkit test_AndEngine test_AppGameKit test_cocos2d
	@ echo "done..."

#2DToolkit ##
test_2DToolkit:
	@ echo "Parsing 2DToolkit..."
	@ ./ssextract.py --verbose 												     \
				  --sheet-format=2DToolkit								    	 \
				  --sheet-image=./test_files/texture_packer/2DToolkit/sheet.png  \
				  --sheet-data=./test_files/texture_packer/2DToolkit/sheet.bytes \
				  --output=./test_output/2DToolkit
## AndEngine ##
test_AndEngine:
	@ echo "Parsing AndEngine..."
	@ ./ssextract.py --verbose 												    \
				  --sheet-format=AndEngine								    	\
				  --sheet-image=./test_files/texture_packer/AndEngine/sheet.png \
				  --sheet-data=./test_files/texture_packer/AndEngine/sheet.xml  \
				  --output=./test_output/AndEngine

## AppGameKit ##
test_AppGameKit:
	@ echo "Parsing AppGameKit..."
	@ ./ssextract.py --verbose 												     \
				  --sheet-format=AppGameKit								    	 \
				  --sheet-image=./test_files/texture_packer/AppGameKit/sheet.png \
				  --sheet-data=./test_files/texture_packer/AppGameKit/sheet.txt  \
				  --output=./test_output/AppGameKit

## Cocos2d ##
test_cocos2d:
	@ echo "Parsing Cocos2d..."
	@ ./ssextract.py --verbose 												   \
				  --sheet-format=cocos2d									   \
				  --sheet-image=./test_files/texture_packer/cocos2d/sheet.png  \
				  --sheet-data=./test_files/texture_packer/cocos2d/sheet.plist \
				  --output=./test_output/cocos2d
