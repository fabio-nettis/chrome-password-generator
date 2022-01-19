import { formatMoney } from "accounting";
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
import Mellt from "./libs/mellt";

const MAX_LENGTH = 64;
const MIN_LENGTH = 13;

function App() {
  const [password, setPassword] = useState("");
  const [hasCopy, setHasCopy] = useState(false);
  const [daysToCrack, setDaysToCrack] = useState(0);
  const [passwordConfig, setPasswordConfig] = useState({
    length: 11,
    special: false,
    numbers: true,
    capitals: true,
  });

  // generate password
  const generate = useCallback(
    (regenerate = false) => {
      const { length, capitals, special, numbers } = passwordConfig;
      setPassword((op) => {
        if (
          regenerate ||
          ((op.length !== MAX_LENGTH || length < op.length) &&
            (op.length !== MIN_LENGTH || length > op.length))
        ) {
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
            psw += characters.charAt(
              Math.floor(Math.random() * characters.length)
            );
          }

          return psw;
        } else {
          return op;
        }
      });
    },
    [passwordConfig]
  );

  // regenerate password
  const regenerate = useCallback(() => {
    generate(true);
  }, [generate]);

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

  // update days to crack
  useEffect(() => {
    setDaysToCrack(new Mellt().CheckPassword(password));
  }, [password]);

  return (
    <div className="app-container">
      <div className="title-container">
        <Icon style={{ fontSize: 14 }} iconName="PermissionsSolid" />
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
            min={MIN_LENGTH}
            max={MAX_LENGTH}
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
          <TooltipHost id="tooltip1" content="Neu" style={{ marginLeft: 8 }}>
            <IconButton
              aria-describedby="tooltip"
              iconProps={{ iconName: "Sync" }}
              onClick={regenerate}
            />
          </TooltipHost>

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
                regenerate();
              }}
            />
          </div>

          <div className="option">
            <Checkbox
              label="Zahlen"
              checked={passwordConfig.numbers}
              onChange={(_, val) => {
                setPasswordConfig((pc) => ({ ...pc, numbers: val }));
                regenerate();
              }}
            />
          </div>

          <div>
            <Checkbox
              label="Sonderzeichen"
              checked={passwordConfig.special}
              onChange={(_, val) => {
                setPasswordConfig((pc) => ({ ...pc, special: val }));
                regenerate();
              }}
            />
          </div>
        </div>

        <Separator />

        <div
          style={{
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.7)",
            userSelect: "none",
            msUserSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
          }}
        >
          Schon gewusst? Es würde{" "}
          <strong style={{ color: "#0078d4" }}>
            {daysToCrack === 0 ? (
              <span>weniger als 1 Tag </span>
            ) : (
              <span>
                {daysToCrack === 1000000000 ? "über" : "zirka"}{" "}
                {formatMoney(daysToCrack, "Tage", 0, "'", ".", "%v %s")}
              </span>
            )}
          </strong>{" "}
          dauern um dieses Passwort zu knacken.
        </div>
      </div>
    </div>
  );
}

export default App;
