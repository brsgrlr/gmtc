const yargs = require("yargs");
const fs = require("fs");
const path = require("path");

const argv = yargs
	.option("rc", {
		alias: "r",
		description: "components klasörü altına react bileşeni oluştur",
		type: "string",
	})
	.option("rnc", {
		alias: "n",
		description: "components klasörü altına react native bileşeni oluştur",
		type: "string",
	})
	.option("ss", {
		alias: "s",
		description: "components klasörü altına styled-system bileşeni oluştur",
		type: "string",
	})
	.help()
	.alias("help", "h").argv;

function createDir() {
	if (!fs.existsSync("components")) {
		fs.mkdir(
			path.join(__dirname, "components"),
			err => err && console.error(err)
		);
	}
}

function clearAndUpper(text) {
	return text.replace(/-/, "").toUpperCase();
}

function toPascalCase(text) {
	return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

if (argv.rc && argv.rc) {
	createDir();
	argv.rc.split(" ").forEach(c => {
		let pascal = toPascalCase(c);
		const template = `const ${pascal} = () => {
  return (
    <div>${pascal}</div>
  )
}

export default ${pascal}`;

		const path = `components/${pascal}.jsx`;
		if (!fs.existsSync(path)) {
			fs.writeFile(path, template, err => err && console.error(err));
		}
	});
}

if (argv.rnc && argv.rnc) {
	createDir();
	argv.rnc.split(" ").forEach(c => {
		let pascal = toPascalCase(c);
		const template = `import { StyleSheet, Text } from 'react-native'

const ${pascal} = () => {
  return <Text>${pascal}</Text>;
};

export default ${pascal};

const styles = StyleSheet.create({});`;

		const path = `components/${pascal}.jsx`;
		if (!fs.existsSync(path)) {
			fs.writeFile(path, template, err => err && console.error(err));
		}
	});
}

if (argv.ss && argv.ss) {
	createDir();
	argv.ss.split(" ").forEach(c => {
		let pascal = toPascalCase(c);
		const template = `import { View } from "react-native";
import styled from "styled-components";
import { compose, color, size, space, flexbox, borderRadius } from "styled-system";

const ${pascal} = styled(View)(compose(color, size, space, flexbox, borderRadius));

export default ${pascal};`;

		const path = `components/${pascal}.jsx`;
		if (!fs.existsSync(path)) {
			fs.writeFile(path, template, err => err && console.error(err));
		}
	});
}
