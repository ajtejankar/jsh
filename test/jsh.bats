#!/usr/bin/env bash

if ! which jsh >/dev/null; then
  npm link
fi

assertEqual() {
  diff="$(diff <(echo "$1") <(echo "$2"))"

  if [[ -n "$diff" ]]; then
    return 1
  fi

  return 0
}

@test "basic command" {
  data='{
    "name": "ajinkya",
    "age": 21
  }'

  output="$(jsh '/age { pf($val) }' <<<"$data")"

  assertEqual "$output" "21"
}
