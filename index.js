#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const path = require("path");

const argv = yargs
	.option("rc", {
		alias: "r",
		description: "react component",
		type: "string",
	})
	.option("rnc", {
		alias: "n",
		description: "react native component",
		type: "string",
	})
	.option("ss", {
		alias: "s",
		description: "(react native) styled system component",
		type: "string",
	})
	.help()
	.alias("help", "h").argv;

function createDir() {
	let dir = path.join(__dirname, "components");
	if (!fs.existsSync(dir)) {
		fs.mkdir(dir, err => err && console.error(err));
	}
}

function clearAndUpper(text) {
	return text.replace(/-/, "").toUpperCase();
}

function toPascalCase(text) {
	return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

const optionList = ["r", "n", "s"];
Object.keys(argv).forEach(k => {
	if (optionList.includes(k)) {
		createDir();
		argv[k].split(" ").forEach(c => {
			let pascal = toPascalCase(c);
			let txt = codeFromTemplate(k, pascal);
			let filename = path.join(__dirname, `components/${pascal}.jsx`);
			if (!fs.existsSync(filename)) {
				fs.writeFile(filename, txt, err => err && console.error(err));
			}
		});
	}
});

function codeFromTemplate(type, name) {
	if (type === "r") {
		return `const ${name} = () => {
  return (
    <div>${name}</div>
  )
}

export default ${name}`;
	} else if (type === "n") {
		return `import { StyleSheet, Text } from 'react-native'

const ${name} = () => {
  return <Text>${name}</Text>;
};

export default ${name};

const styles = StyleSheet.create({});`;
	} else if (type === "s") {
		return `import { View } from "react-native";
import styled from "styled-components";
import { compose, color, size, space, flexbox, borderRadius } from "styled-system";

const ${name} = styled(View)(compose(color, size, space, flexbox, borderRadius));

export default ${name};`;
	}
}
