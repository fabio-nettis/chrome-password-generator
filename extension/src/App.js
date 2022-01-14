import { Icon } from "@fluentui/react/lib/Icon";
import { useCallback, useEffect, useState } from "react";

import {
  Slider,
  Separator,
  Checkbox,
  IconButton,
  TextField,
  TooltipHost,
} from "@fluentui/react";

import "./App.css";

function App() {
  const [password, setPassword] = useState("");
  const [hasCopy, setHasCopy] = useState(false);
  const [passwordConfig, setPasswordConfig] = useState({
    length: 11,
    special: false,
    numbers: true,
    capitals: true,
  });

  // generate password
  const generate = useCallback(() => {
    const { length, capitals, special, numbers } = passwordConfig;
    setPassword(() => {
      let psw = "";
      let characters = "abcdefghijklmnopqrstuvwxyz";

      if (capitals) {
        characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      }

      if (numbers) {
        characters += "0123456789";
      }

      if (special) {
        characters += "!.@#$%^&*_-+=";
      }

      for (let i = 0; i < length; i++) {
        psw += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      return psw;
    });
  }, [passwordConfig]);

  // copies the password into the clipboard
  const copy = useCallback(async () => {
    setHasCopy(true);
    navigator.clipboard.writeText(password);
    setTimeout(() => {
      setHasCopy(false);
    }, 1000);
  }, [password]);

  // generate the initial password
  useEffect(() => {
    generate();
  }, [passwordConfig]);

  return (
    <div className="app-container">
      <div className="title-container">
        <Icon style={{ fontSize: 14 }} iconName="PasswordField" />
        <p className="title-text">Passwort Generator</p>
        <Icon
          onClick={() => {
            window.close();
          }}
          style={{ fontSize: 14, cursor: "pointer" }}
          iconName="Cancel"
        />
      </div>

      <div className="main-container">
        <div>
          <Slider
            min={7}
            max={64}
            value={passwordConfig.length}
            onChange={(value) => {
              setPasswordConfig((pc) => ({ ...pc, length: value }));
            }}
          />
        </div>

        <Separator />

        <div className="result-container">
          <div className="result">
            <TextField
              styles={{
                field: {
                  fontSize: 30,
                  fontWeight: 600,
                  backgroundColor: "transparent",
                },
                root: {
                  borderColor: "transparent",
                },
              }}
              placeholder="Passwort"
              value={password}
              disabled
            />
          </div>
          <TooltipHost id="tooltip" content="Kopieren">
            <IconButton
              aria-describedby="tooltip"
              iconProps={{ iconName: hasCopy ? "SkypeCircleCheck" : "Copy" }}
              onClick={hasCopy ? undefined : copy}
            />
          </TooltipHost>
        </div>

        <Separator />

        <div className="options-container">
          <div className="option">
            <Checkbox
              label="Grossbuchstaben"
              checked={passwordConfig.capitals}
              onChange={(_, val) => {
                setPasswordConfig((pc) => ({ ...pc, capitals: val }));
              }}
            />
          </div>

          <div className="option">
            <Checkbox
              label="Zahlen"
              checked={passwordConfig.numbers}
              onChange={(_, val) => {
                setPasswordConfig((pc) => ({ ...pc, numbers: val }));
              }}
            />
          </div>

          <div>
            <Checkbox
              label="Sonderzeichen"
              checked={passwordConfig.special}
              onChange={(_, val) => {
                setPasswordConfig((pc) => ({ ...pc, special: val }));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
