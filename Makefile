SRC_DIR   = source
BUILD_DIR = build

PREFIX    = .
MOD_DIR   = ${PREFIX}/node_modules
DIST_DIR  = ${PREFIX}/dist
EXT_DIR   = ${SRC_DIR}/externals

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
	${SRC_DIR}/canvas-prototype.js

TEST_FILES = ${BASE_FILES}\
	${SRC_DIR}/ui-overlay.js

UI_FILES = ${BASE_FILES}\
	${SRC_DIR}/ui-popup.js\
	${SRC_DIR}/ui-canvas-select.js

JQUERY_UI_FILES = ${SRC_DIR}/intro.js\
	${EXT_DIR}/jquery.js\
	${UI_FILES}

CR               = ${DIST_DIR}/canvas-renderer.js
CR_MIN           = ${DIST_DIR}/canvas-renderer-min.js

CR_TEST          = ${DIST_DIR}/canvas-renderer-test.js
CR_TEST_MIN      = ${DIST_DIR}/canvas-renderer-test-min.js

CR_UI            = ${DIST_DIR}/canvas-renderer-ui.js
CR_UI_MIN        = ${DIST_DIR}/canvas-renderer-ui-min.js

CR_JQUERY_UI     = ${DIST_DIR}/canvas-renderer-ui-jquery.js
CR_JQUERY_UI_MIN = ${DIST_DIR}/canvas-renderer-ui-jquery-min.js

CR_VER = $(shell cat version.txt)
DATE   = $(shell git log -1 --pretty=format:%ad)


all: ${CR} ${CR_MIN} ${CR_TEST} ${CR_TEST_MIN} ${CR_UI} ${CR_UI_MIN} ${CR_JQUERY_UI} ${CR_JQUERY_UI_MIN}

core: canvas_renderer

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

canvas_renderer: ${CR}

${CR}: ${BASE_FILES} | ${DIST_DIR}
	@@echo "Building" ${CR}

	@@cat ${BASE_FILES} |               \
		sed 's/@DATE/'"${DATE}"'/' |    \
		sed 's/@VERSION/'"${CR_VER}"'/' \
		> ${CR};

${CR_TEST}: ${TEST_FILES} | ${DIST_DIR}
	@@echo "Building" ${CR_TEST}

	@@cat ${TEST_FILES} |               \
		sed 's/@DATE/'"${DATE}"'/' |    \
		sed 's/@VERSION/'"${CR_VER}"'/' \
		> ${CR_TEST};

${CR_UI}: ${UI_FILES} | ${DIST_DIR}
	@@echo "Building" ${CR_UI}

	@@cat ${UI_FILES} |                 \
		sed 's/@DATE/'"${DATE}"'/' |    \
		sed 's/@VERSION/'"${CR_VER}"'/' \
		> ${CR_UI};

${CR_JQUERY_UI}: ${BASE_FILES} | ${DIST_DIR}
	@@echo "Building" ${CR_JQUERY_UI}

	@@cat ${JQUERY_UI_FILES} |          \
		sed 's/@DATE/'"${DATE}"'/' |    \
		sed 's/@VERSION/'"${CR_VER}"'/' \
		> ${CR_JQUERY_UI};

${CR_MIN}: ${CR}
	@@if test ! -z ${JS_ENGINE}; then                                     \
		echo "Minifying" ${CR_MIN};                                       \
		${COMPILER} ${CR} > ${CR_MIN};                                    \
	else                                                                  \
		echo "You must have NodeJS installed in order to minify jQuery."; \
	fi

${CR_TEST_MIN}: ${CR_TEST}
	@@if test ! -z ${JS_ENGINE}; then                                     \
		echo "Minifying" ${CR_TEST_MIN};                                  \
		${COMPILER} ${CR_TEST} > ${CR_TEST_MIN};                          \
	else                                                                  \
		echo "You must have NodeJS installed in order to minify jQuery."; \
	fi

${CR_UI_MIN}: ${CR_UI}
	@@if test ! -z ${JS_ENGINE}; then                                     \
		echo "Minifying" ${CR_UI_MIN};                                    \
		${COMPILER} ${CR_UI} > ${CR_UI_MIN};                              \
	else                                                                  \
		echo "You must have NodeJS installed in order to minify jQuery."; \
	fi

${CR_JQUERY_UI_MIN}: ${CR}
	@@if test ! -z ${JS_ENGINE}; then                                     \
		echo "Minifying" ${CR_JQUERY_UI_MIN};                             \
		${COMPILER} ${CR_JQUERY_UI} > ${CR_JQUERY_UI_MIN};                \
	else                                                                  \
		echo "You must have NodeJS installed in order to minify jQuery."; \
	fi

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

.PHONY: all canvas_renderer