#!/bin/bash

old_version="tachyon.1.18"
new_version="tachyon.1.19"

## update all .html filenames
#for filename in */*.html
#do 
#	#strip  the .html suffix and add version name
#	#mv "$filename" "${filename%.html}.$new_version.html" ##uncomment this line
#	new_filename="${filename%.html}.$new_version.html"
#	echo  "$filename --> $new_filename"
#done


### UPDATE JS AND CSS FILES BY APPENDING ?VERSION#

## FIRST TIME ONLY --- DO NOT USE AGAIN
#append ?.tachyon.Version to all js filenames in every html file
#sed -i "s|\.js|\.js?$old_version|" */*.html
#sed -i "s|\.css|\.css?$old_version|" */*.html

## USE THIS ONE ##
sed -i "s|$old_version|$new_version|" */*.html
