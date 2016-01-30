# JSH

Utility for processing json on command line.

# Installation

You need node and npm to use this program.

```
npm i -g chigur/jsh
```

# Why?

There are already some projects that solve the problem of command line json
processing but I just didn't like learning any of them, so I made my own
command line utility for it. This program doesn't invent fancy json querying
and manipulating syntax. Querying is done by globs and manipulating is done
by javascript. Simple and easy.

# How?

```
curl https://api.github.com/users/chigur/gists | jsh ' **/description { pf($val) } '
```

Jsh takes pairs of `pattern` and `action` in following format.

```
<pattern> { <action> // pair 1 }
<pattern> { <action> // pair 2 }
```

Patterns are glob patterns, your json is flattened into key value pairs where
keys resemeble file paths.

Consider following object

```json
{
  "name": {
    "arr": [1],
    "age": 21
  }
}
```

It becomes

```
/name/arr/0   1
/name/age     21
```

Actions are any valid javascript code snippets, they can use certain aliases
and variables like `$key` for the path or key, `$val` for value, `pf` and `bn`
functions as aliases for `console.log` and `require('path').basename` respectively.
Actions can contain javascript style comments and span across multiple lines.
