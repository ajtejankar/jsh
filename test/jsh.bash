#!/usr/bin/env bash

set -e

if ! which jsh >/dev/null; then
  npm link
fi

assertEqual() {
  diff="$(diff <(echo "$1") <(echo "$2"))"

  if [[ -n "$diff" ]]; then
    printf " : ✗\n"
    echo "$diff"
    return 1
  fi

  return 0
}

((count = 1))

printf " $((count++)). basic command"
  data='{
    "name": "ajinkya",
    "age": 21
  }'

  output="$(jsh '/age { pf($val) }' <<<"$data")"

  assertEqual "$output" "21"
printf " : ✓\n"

printf " $((count++)). object querying"
  data='{
    "people": [{
      "name": "ajinkya",
      "age": 21
    }, {
      "name": "ram",
      "age": 25
    }],
    "capitals": {
      "india": { "name": "delhi" },
      "france": { "name": "paris" },
      "germany": { "name": "berlin" },
      "russia": { "name": "moscow" }
    }
  }'

  command1='/people/* {
    if ($val.age <= 21) pf($val.age);
    else pf($val.name);
  }
  '

  command2='/capitals/* { pf($val.name) }'

  expectedOutput='21
ram
delhi
paris
berlin
moscow'

  output="$(jsh "$command1 $command2" <<<"$data")"

  assertEqual "$output" "$expectedOutput"
printf " : ✓\n"
