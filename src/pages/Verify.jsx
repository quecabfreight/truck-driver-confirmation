   // /src/pages/Verify.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpper(s) {
  return String(s || "").toUpperCase();
}

function formatPhoneHyphen(s) {
 
