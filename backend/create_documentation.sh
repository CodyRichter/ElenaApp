rm -rf pydoc_docs
mkdir -p pydoc_docs
pydoc -w `find . -name '*.py'`
mv *.html pydoc_docs