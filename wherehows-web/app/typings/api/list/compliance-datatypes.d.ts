import { Classification, ComplianceFieldIdValue, IdLogicalType, NonIdLogicalType } from 'wherehows-web/constants';

/**
 * Describes the interface for a complianceDataType
 * @export
 * @interface IComplianceDataType
 */
export interface IComplianceDataType {
  // Indicates that id contains pii
  pii: boolean;
  // Flag indicating if a field with this id is a member identifier
  idType: boolean;
  // The default security classification for the field with this id
  defaultSecurityClassification: Classification;
  // User friendly translation for the id string
  title: string;
  // Urn for the id
  $URN: string;
  // List of field formats supported for a field with the id, only applicable to fields with idType set to true
  supportedFieldFormats: Array<IdLogicalType>;
  // The id for the field
  id: ComplianceFieldIdValue | NonIdLogicalType;
  // A short description for this data type
  description?: string;
}

/**
 * Describes the interface for a request to the complianceDataType endpoint
 * @export
 * @interface IComplianceDataTypeResponse
 */
export interface IComplianceDataTypeResponse {
  complianceDataTypes?: Array<IComplianceDataType>;
}
