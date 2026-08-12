#!/usr/bin/env bash
set -euo pipefail

source_dir=$(pwd)
test_root=/opt/cloudflare-pages-test

rm -rf "$test_root"
mkdir -p "$test_root/repo"

tar --exclude=docs/_site --exclude=docs/.bundle --exclude=docs/vendor \
  -C "$source_dir" -cf - . | tar -C "$test_root/repo" -xf -

cd "$test_root/repo/docs"
export RBENV_ROOT=/opt/rbenv
export BUNDLE_PATH="$test_root/bundle"
export BUNDLE_WITHOUT='development test'
# Cloudflare's Ruby build environment defaults external file encoding to
# US-ASCII. Force the same locale so non-ASCII bibliography input is tested.
export LANG=C
export LC_ALL=C

/opt/rbenv/bin/rbenv exec bundle install
unset BUNDLE_WITHOUT
/opt/rbenv/bin/rbenv exec bundle exec jekyll build --trace
