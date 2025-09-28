import { defineRule } from "vee-validate";

export default defineNuxtPlugin((vueApp) => {
  defineRule("conditional", (value, [other], ctx) => {
    if (!other) {
      return !!value || "Field Required";
    }
    return true;
  });
  defineRule("onerequired", (value, [], ctx) => {
    return !!value || value?.length || "At least one selection required";
  });
  defineRule("multipleChoiceRule", (value, [], ctx) => {
    return value.find((e) => e.answer == true) || "You must select an answer!";
    // return !!value || value?.length || "At least one selection required";
  });
  defineRule("arrayRequired", (value, [], ctx) => {
    return value?.length || "At least one must be Added.";
  });
  defineRule("required", (value, [], ctx) => {
    if (typeof value == "number" && value == 0) {
      return true;
    }
    return !!value || value?.length || "Field Required";
  });
  defineRule("boolReq", (value, [], ctx) => {
    return typeof value == "boolean" || "Field Required";
  });

  defineRule("lenInterval", (value, [], context) => {
    if (!value) {
      return true;
    }
    if (
      value?.length >= context.rule.params[0] &&
      value?.length <= context.rule.params[1]
    ) {
      return true;
    } else {
      let show =
        context.rule.params[0] == context.rule.params[1]
          ? `must be ${context.rule.params[0]} digits`
          : `must be between ${context.rule.params[0]} - ${context.rule.params[1]} digits`;
      return `${context.field} ${show}`;
    }
  });
  defineRule("url", (value, context) => {
    return (
      !value ||
      /^(https?:\/\/)?((([a-zA-Z\d]([a-zA-Z\d-]*[a-zA-Z\d])*)\.)+[a-zA-Z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-zA-Z\d%_.~+]*)*(\?[;&a-zA-Z\d%_.~+=-]*)?(#[-a-zA-Z\d_]*)?$/.test(
        value
      ) ||
      "Not valid url"
    );
  });

  defineRule("conditionalRequired", (value, [arrayLength]) => {
    // Convert the passed length to a number since it comes as a string
    const length = parseInt(arrayLength, 10);

    console.log("Array length:", length);
    console.log("Input value:", value);

    // If array is empty (length is 0), require the input
    if (length === 0) {
      return value ? true : "This field is required";
    }

    return true;
  });

  defineRule("number", (value) => {
    return !value || /^[0-9]+$/.test(value) || "Number only";
  });
  defineRule("numberFromZero", (value, [], ctx) => {
    return /^(?:0|[1-9]\d*)$/.test(value) || "Number only";
  });
  defineRule("numrange", (value) => {
    return !value || /^[0-9-]+$/.test(value) || "Number only";
  });
  defineRule("email", (value) => {
    return (
      !value ||
      /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        value
      ) ||
      "Not Valid Email"
    );
  });
  defineRule("International_phone_number", (value) => {
    return (
      !value ||
      /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ||
      "Not valid phone number"
    );
  });
  defineRule("min", (value, [], context) => {
    if (Number(value) > Number(context.rule.params[0])) {
      return true;
    } else {
      return `${context.field} must be greater than ${context.rule.params[0]}`;
    }
  });
  defineRule("minequal", (value, [], context) => {
    return (
      Number(value) >= Number(context.rule.params[0]) ||
      `${context.field} must be greater than or equal to ${context.rule.params[0]}`
    );
  });
  defineRule("max", (value, [], context) => {
    return (
      Number(value) < Number(context.rule.params[0]) ||
      `${context.field} must be less than or equal to ${context.rule.params[0]}`
    );
  });
  defineRule("maxequal", (value, [], context) => {
    return (
      Number(value) <= Number(context.rule.params[0]) ||
      `${context.field} must be less than or equal to ${context.rule.params[0]}`
    );
  });
  defineRule("minLength", (value, [], context) => {
    if (value.length >= context.rule.params[0]) {
      return true;
    } else {
      return `${context.field} must be greater than ${context.rule.params[0]}`;
    }
  });

  defineRule("ethiopian_phone_number", (value) => {
    return (
      !value ||
      /^\+251[0123456789]\d{8}$/.test(value) ||
      "Not valid phone number"
    );
  });
  defineRule("ethio_phone", (value) => {
    return (
      !value ||
      /^(0|1|2|3|4|5|6|7|8|9)\d{8}$/.test(value) ||
      "Not valid phone number"
    );
  });
  defineRule("password", (value) => {
    return !value || value.length >= 8 || "Must be greater than 8";
  });
  defineRule("confirmed", (value, [other]) => {
    return !value || value === other || "Password is not the same";
  });
  defineRule("dyrequiredemail", (value, [other], ctx) => {
    return (
      ctx.rule.params[0] != "email" ||
      !!value ||
      value?.length ||
      "Field Required"
    );
  });

  defineRule("maxValue", (value, [limit], context) => {
    if (!value) {
      return true;
    }

    if (parseInt(value) > parseInt(limit)) {
      return `${context.field} must be less than or equal to ${limit}!`;
    }
    return true;
  });
  defineRule("dyrequiredlink", (value, [other], ctx) => {
    return (
      ctx.rule.params[0] != "link" ||
      !!value ||
      value?.length ||
      "Field Required"
    );
  });
  defineRule("validPassword", (value) => {
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    return (
      !value ||
      strongRegex.test(value) ||
      "The password should contain letters, numbers, uppercase and special symbols."
    );
  });
  defineRule("amChar", (value) => {
    return (
      !value ||
      /[\u1200-\u137F]/.test(value.replace(/\s/g)) ||
      "This filed only accepts Amharic characters"
    );
  });
  defineRule("enChar", (value) => {
    return (
      !value ||
      !/[\u1200-\u137F]/.test(value.replace(/\s/g)) ||
      "This filed only accepts English characters"
    );
  });
});
