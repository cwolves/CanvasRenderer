SRC_DIR   = source
BUILD_DIR = build

PREFIX    = .
MOD_DIR   = ${PREFIX}/node_modules
DIST_DIR  = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER   = ${MOD_DIR}/uglify-js/bin/uglifyjs --unsafe

BASE_FILES = ${SRC_DIR}/intro.js\
	${SRC_DIR}/html2canvas.js\
	${SRC_DIR}/bridges/jquery-bridge.js\
	${SRC_DIR}/image-loader.js\
	${SRC_DIR}/logger.js\
	${SRC_DIR}/renderer.js\
	${SRC_DIR}/box-renderer.js\
	${SRC_DIR}/image-renderer.js\
	${SRC_DIR}/background-image-renderer.js\
	${SRC_DIR}/text-renderer.js\
	${SRC_DIR}/z-index.js\
	${SRC_DIR}/canvas-prototype.js\
	${SRC_DIR}/overlay-ui.js

CR     = ${DIST_DIR}/canvas-renderer.js
CR_MIN = ${DIST_DIR}/canvas-renderer-min.js

CR_VER = $(shell cat version.txt)
DATE   = $(shell git log -1 --pretty=format:%ad)

all: core min

core: canvas_renderer

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

canvas_renderer: ${CR}

${CR}: ${BASE_FILES} | ${DIST_DIR}
	@@echo "Building" ${CR}

	@@cat ${BASE_FILES} | \
		sed 's/@DATE/'"${DATE}"'/' | \
		sed 's/@VERSION/'"${CR_VER}"'/' \
		> ${CR};

min: canvas_renderer ${CR_MIN}

${CR_MIN}: ${CR}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying CanvasRenderer" ${CR_MIN}; \
		${COMPILER} ${CR} > ${CR_MIN}; \
	else \
		echo "You must have NodeJS installed in order to minify jQuery."; \
	fi

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

.PHONY: all canvas_renderer
