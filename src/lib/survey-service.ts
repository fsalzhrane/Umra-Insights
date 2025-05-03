
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type SurveyResponse = {
  id?: string;
  title: string;
  answers: any; // This will be stored as JSONB in Supabase
  user_id: string;
};

export async function submitSurvey(surveyData: SurveyResponse) {
  try {
    // First check if user has already submitted a survey
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('survey_completed')
      .eq('id', surveyData.user_id)
      .single();

    if (profileError) {
      console.error("Error checking profile:", profileError);
      throw profileError;
    }

    if (profileData.survey_completed) {
      throw new Error("You have already submitted a survey.");
    }

    // Submit survey
    const { data, error } = await supabase
      .from('surveys')
      .insert([surveyData])
      .select();

    if (error) {
      console.error("Error submitting survey:", error);
      throw error;
    }

    // Update user profile to mark survey as completed
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ survey_completed: true })
      .eq('id', surveyData.user_id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      // Don't throw here, as the survey was already submitted
    }

    return data[0];
  } catch (error: any) {
    console.error("Failed to submit survey:", error);
    throw error;
  }
}

export async function getUserSurveys(userId: string) {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching user surveys:", error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Failed to fetch surveys:", error);
    throw error;
  }
}

export async function getSurveyById(surveyId: string) {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single();

    if (error) {
      console.error("Error fetching survey:", error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Failed to fetch survey:", error);
    throw error;
  }
}

export async function checkIfUserCanTakeSurvey(userId: string) {
  try {
    // First check if user already completed a survey
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('survey_completed, id_number')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error("Error checking profile status:", profileError);
      throw profileError;
    }

    if (profile.survey_completed) {
      return { canTakeSurvey: false, reason: "You have already completed the survey." };
    }

    // If no ID number is set yet, allow them to take the survey anyway
    // This removes a potential blocker for new users
    if (!profile.id_number) {
      return { canTakeSurvey: true, reason: null };
    }

    // Check if the ID exists in the umra_takers table
    const { data: umraTaker, error: umraTakerError } = await supabase
      .from('umra_takers')
      .select('id')
      .eq('id_number', profile.id_number)
      .maybeSingle(); // Using maybeSingle instead of single to avoid errors

    if (umraTakerError) {
      console.error("Error checking umra_taker status:", umraTakerError);
      throw umraTakerError;
    }

    // If no matching ID found, still allow them to take the survey but log a warning
    if (!umraTaker) {
      console.warn("User ID number not found in umra_takers, but allowing survey access");
      return { canTakeSurvey: true, reason: null };
    }

    // If we get here, the user can take the survey
    return { canTakeSurvey: true, reason: null };
  } catch (error: any) {
    console.error("Failed to check eligibility:", error);
    // Return a more specific error message instead of throwing
    return { 
      canTakeSurvey: false, 
      reason: "Unable to verify your eligibility right now. Please try again later."
    };
  }
}

export async function verifyUmrahIdNumber(idNumber: string) {
  try {
    // Check if ID exists in umra_takers table
    const { data: takerData, error: takerError } = await supabase
      .from('umra_takers')
      .select('id, id_number, umra_date')
      .eq('id_number', idNumber)
      .single();

    if (takerError) {
      console.error("Error verifying ID in umra_takers:", takerError);
      return { valid: false, data: null };
    }
    
    // Check if ID is already linked to another user via profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id_number', idNumber)
      .not('id', 'is', null);
      
    if (!profileError && profileData && profileData.length > 0) {
      console.log("ID already linked to another user:", profileData);
      return { valid: false, data: null };
    }

    return { valid: true, data: takerData };
  } catch (error: any) {
    console.error("Failed to verify ID number:", error);
    throw error;
  }
}

export async function linkUmrahIdToUser(umrahId: string, userId: string) {
  try {
    // Get the taker record
    const { data: takerData, error: takerError } = await supabase
      .from('umra_takers')
      .select('id')
      .eq('id_number', umrahId)
      .single();
      
    if (takerError) {
      console.error("Error finding taker record:", takerError);
      throw takerError;
    }

    // Update user profile with the ID number
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({ id_number: umrahId })
      .eq('id', userId)
      .select();

    if (profileError) {
      console.error("Error updating profile with ID number:", profileError);
      throw profileError;
    }

    return { success: true, data: profileData?.[0] };
  } catch (error: any) {
    console.error("Failed to link ID number:", error);
    throw error;
  }
}

export async function getAllSurveysForAdmin() {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching surveys for admin:", error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Failed to fetch surveys for admin:", error);
    throw error;
  }
}
