/*
LICENSE
The code on the following page has been adapted from
the GNU Classpath project, which is licensed under the
GNU General Public License. As such, this page of code
is similarly licensed under the GNU General Public
License.

DCT.js is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2, or (at your option)
any later version.

DCT.js is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with DCT.js; see the file COPYING.
If not, write to the Free Software Foundation, Inc., 51 Franklin Street,
Fifth Floor, Boston, MA 02110-1301 USA.

MODIFICATIONS
GNU Classpath is a large set of libraries for the Java
platform. The code on this page is a small subset of
what is available (namely the DCT library), ported to
JavaScript.

ORIGINAL FILES
You may gain access to GNU Classpath via their official
site: https://www.gnu.org/software/classpath/home.html

You can find the original of THIS particular code by
browsing to gnu\javax\imageio\jpeg\DCT.java within the
GNU classpath package

FOOTNOTE
If there are any issues or concerns regarding the licensing or 
licensing compliance shown here, please write to hello@nerdfirst.net
and we will do our utmost to be of assistance.
*/

var c = [[],[],[],[],[],[],[],[]];
var cT = [[],[],[],[],[],[],[],[]];
var initialized = false;

function initMatrix() {
	if (initialized) return;
	
	initialized = true;
	for (var j=0; j<8; j++) {
		c[0][j] = 1.0 / Math.sqrt(8.0);
		cT[j][0] = c[0][j];
	}
	
	for (var i=1; i<8; i++) {
		for (var j=0; j<8; j++) {
			c[i][j] = Math.sqrt(2.0/8.0) * Math.cos(((2.0 * j + 1.0) * i * Math.PI) / (2.0 * 8.0));
			cT[j][i] = c[i][j];
		}
	}
}

function forwardDCT(input) {
	initMatrix();
	var output = [[],[],[],[],[],[],[],[]];
	var temp = [[],[],[],[],[],[],[],[]];
	var temp1;
	
	for (var i=0; i<8; i++) {
		for (var j=0; j<8; j++) {
			temp[i][j] = 0.0;
			for (k=0; k<8; k++) {
				temp[i][j] += ((input[i][k] - 128) * cT[k][j]);
			}
		}
	}
	
	for (var i=0; i<8; i++) {
		for (var j=0; j<8; j++) {
			temp1 = 0.0;
			for (var k=0; k<8; k++) {
				temp1 += (c[i][k] * temp[k][j]);
			}
			output[i][j] = Math.round(temp1);
		}
	}
	
	return output;
}

function inverseDCT(input) {
	initMatrix();
	var output = [[],[],[],[],[],[],[],[]];
	var temp = [[],[],[],[],[],[],[],[]];
	var temp1;
	
	for (var i=0; i<8; i++) {
		for (var j=0; j<8; j++) {
			temp[i][j] = 0.0;
			for (var k=0; k<8; k++) {
				temp[i][j] += input[i][k] * c[k][j];
			}
		}
	}
	
	for (var i=0; i<8; i++) {
		for (var j=0; j<8; j++) {
			temp1 = 0.0;
			for (var k=0; k<8; k++) {
				temp1 += cT[i][k] * temp[k][j];
			}
			
			temp1 += 128.0;
			
			if (temp1 < 0) {
				output[i][j] = 0;
			}
			else if (temp1 > 255) {
				output[i][j] = 255;
			}
			else {
				output[i][j] = Math.round(temp1);
			}
		}
	}
	
	return output;
}